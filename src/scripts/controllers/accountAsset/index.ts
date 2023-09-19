import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import CipherPreferencesController from '../preferences';
import CipherKeyringController from '../keyring/cipherKeyringController';
import CipherMobileNetworkController from '../network';
import Token, { TokenInfo, TokenTable, database } from './watermelonDB';
import ethereumTokens from './lib/ethereum.json';
import polygonTokens from './lib/polygon.json';
import bscTokens from './lib/binance.json';
import klaytnTokens from './lib/klaytn.json';
import avalancheTokens from './lib/avalanche.json';
import { Q } from '@nozbe/watermelondb';
import {
  AVAX_CHAIN_ID,
  BSC_CHAIN_ID,
  KLAYTN_CYPRESS_CHAIN_ID,
  MAINNET_CHAIN_ID,
  POLYGON_CHAIN_ID,
} from '@constants/network';
import { Addresses } from '../keyring';
import { DEFAULT_TOKEN, NATIVE_TOKEN_ADDRESS } from '@constants/asset';
import { moralisApiUrl, nativepriceAPi } from './lib/apiOptions';
import axios from 'axios';
import Constants from '@constants/app';
//@ts-ignore
import { MORALIS_API_KEY } from '@env';
import BigNumber from 'bignumber.js';
import EventEmitter from 'events';
import axiosClient from '@utils/axios';
import { convertCoingeckoToMoralis } from './lib/utils';

export const MoralisClient = axios.create({
  timeout: Constants.REQUEST_TIMEOUT,
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'X-API-Key': MORALIS_API_KEY,
  },
});

export const ASSET_EVENTS = {
  GET_PRICES: 'get prices',
  PRICES_UPDATED: 'pricesUpdated',
};

export interface Asset {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
  chainId: string;
  isNative: boolean;
}

interface ActivatedAssetList {
  [address: string]: {
    [chainId: string]: Asset[];
  };
}

export interface MoralisToken {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  usdPrice: BigNumber;
  dayPercentChange: string;
  tokenAddress: string;
}

interface MoralisTokenList {
  [tokenAddress: string]: {
    [chainId: string]: MoralisToken[];
  };
}

interface TimeStampList {
  [tokenAddress: string]: number;
}

export interface AccountAssetState extends BaseState {
  activatedAssetsList: ActivatedAssetList;
  moralisTokenList: MoralisTokenList;
  timeStampList: TimeStampList;
}

export interface AccountAssetOpts {
  initState: AccountAssetState | undefined;
  keyringController: CipherKeyringController;
  preferencesController: CipherPreferencesController;
  networkController: CipherMobileNetworkController;
}

export class AccountAssetController extends BaseController<
  BaseConfig,
  AccountAssetState
> {
  name = 'AccountAssetController';
  private _keyrings: CipherKeyringController;
  private _preferences: CipherPreferencesController;
  private _network: CipherMobileNetworkController;
  private activatedAssetsList: ActivatedAssetList = {};
  private moralisTokenList: MoralisTokenList = {};
  private timeStampList: TimeStampList = {};

  hub = new EventEmitter();

  constructor(opts: AccountAssetOpts) {
    super(undefined, opts.initState ?? {});
    this._keyrings = opts.keyringController;
    this._preferences = opts.preferencesController;
    this._network = opts.networkController;
    this.activatedAssetsList = opts.initState?.activatedAssetsList ?? {};
    this.moralisTokenList = opts.initState?.moralisTokenList ?? {};
    this.timeStampList = opts.initState?.timeStampList ?? {};
    this.initialTokenInfos.bind(this)();
    this._keyrings.hub.on('newAccount', this.setDefaultTokens.bind(this));
    this.hub.on(ASSET_EVENTS.GET_PRICES, this.getCurrentPrices.bind(this));
    this.initialize();
  }

  fullUpdate() {
    this.update({
      ...this.state,
      activatedAssetsList: this.activatedAssetsList,
      moralisTokenList: this.moralisTokenList,
      timeStampList: this.timeStampList,
    });
  }

  async initialTokenInfos() {
    const tokenCollection = database.collections.get<Token>(TokenTable);
    const tokenList = await tokenCollection.query().fetch();
    if (tokenList.length <= 0) {
      Promise.all([
        this.saveTokens(MAINNET_CHAIN_ID, ethereumTokens.TokenList),
        this.saveTokens(POLYGON_CHAIN_ID, polygonTokens.TokenList),
        this.saveTokens(BSC_CHAIN_ID, bscTokens.TokenList),
        this.saveTokens(KLAYTN_CYPRESS_CHAIN_ID, klaytnTokens.TokenList),
        this.saveTokens(AVAX_CHAIN_ID, avalancheTokens.TokenList),
      ]);
    }
  }

  async saveTokens(chainId: string, tokens: TokenInfo[]) {
    const tokenCollection = database.collections.get<Token>(TokenTable);
    try {
      database.write(async () => {
        await database.batch(
          ...tokens.map(token => {
            return tokenCollection.prepareCreate((t: Token) => {
              t.chainId = chainId;
              t.address = token.Address;
              t.name = token.Name;
              t.symbol = token.Symbol;
              t.decimals = token.Decimals;
            });
          }),
        );
      });
    } catch (e) {
      console.warn('tokenList error', e);
    }
  }

  async getAllTokensByChainId(chainId?: string) {
    const tokenCollection = database.collections.get('tokens');
    if (chainId) {
      return (
        await tokenCollection.query(Q.where('chain_id', chainId)).fetch()
      ).map(token => {
        return token?._raw;
      });
    } else {
      return (await tokenCollection.query().fetch()).map(token => {
        return token?._raw;
      });
    }
  }

  async getTokensByAddrAndChainId(address: string, chainId: string) {
    if (address === NATIVE_TOKEN_ADDRESS) {
      return [DEFAULT_TOKEN.find(token => token.chainId === chainId)!];
    }
    const tokenCollection = database.collections.get('tokens');
    return await tokenCollection
      .query(Q.and(Q.where('chain_id', chainId), Q.where('address', address)))
      .fetch();
  }

  async setDefaultTokens(addresses: Addresses) {
    this.activatedAssetsList = {
      ...this.activatedAssetsList,
      [addresses.evm as string]: {
        [MAINNET_CHAIN_ID]: [
          DEFAULT_TOKEN.find(token => token.chainId === MAINNET_CHAIN_ID)!,
        ] as unknown as Asset[],
        [POLYGON_CHAIN_ID]: [
          DEFAULT_TOKEN.find(token => token.chainId === POLYGON_CHAIN_ID)!,
        ] as unknown as Asset[],
        [BSC_CHAIN_ID]: [
          DEFAULT_TOKEN.find(token => token.chainId === BSC_CHAIN_ID)!,
        ] as unknown as Asset[],
        [KLAYTN_CYPRESS_CHAIN_ID]: [
          DEFAULT_TOKEN.find(
            token => token.chainId === KLAYTN_CYPRESS_CHAIN_ID,
          )!,
        ] as unknown as Asset[],
        [AVAX_CHAIN_ID]: [
          DEFAULT_TOKEN.find(token => token.chainId === AVAX_CHAIN_ID)!,
        ] as unknown as Asset[],
      },
    };
    this.fullUpdate();
    await this.getCurrentPrices();
  }

  getActivatedAssets() {
    return this.activatedAssetsList[this._preferences.getSelectedAddress()];
  }

  async getCurrentPrices() {
    const timestamp =
      this.timeStampList[this._preferences.getSelectedAddress()];
    // if (timestamp && Date.now() - timestamp < 1000 * 60 * 5) {
    //   this.hub.emit(
    //     ASSET_EVENTS.PRICES_UPDATED,
    //     this.moralisTokenList[this._preferences.getSelectedAddress()],
    //   );
    //   return;
    // }
    const tokens = this.getActivatedAssets();
    if (tokens) {
      try {
        const prices = await Promise.all(
          Object.entries(tokens).map(async ([chainId, assets]) => {
            const api = moralisApiUrl(chainId);
            const tokenData = assets
              .map(asset => {
                return { token_address: asset.address };
              })
              .filter(token => token.token_address !== NATIVE_TOKEN_ADDRESS);
            if (tokenData.length > 0) {
              const result = await MoralisClient.post(
                api,
                JSON.stringify({ tokens: tokenData }),
              );
              if (result.data) {
                return {
                  [chainId]:
                    result.data?.map((token: any) => {
                      return {
                        tokenName: token?.tokenName,
                        tokenSymbol: token?.tokenSymbol,
                        tokenLogo: token?.tokenLogo,
                        usdPrice: new BigNumber(token?.usdPrice ?? 0),
                        dayPercentChange: token?.['24hrPercentChange'],
                        tokenAddress: token.address,
                      };
                    }) ?? [],
                };
              }
              return { [chainId]: [] };
            }
            return { [chainId]: [] };
          }),
        );
        const result = prices?.reduce((acc, cur) => {
          return { ...acc, ...cur };
        });
        const nativePrice = (await axiosClient.get(nativepriceAPi))?.data;
        const nativeData = convertCoingeckoToMoralis(nativePrice);
        nativeData.forEach(data => {
          if (data?.chainId) {
            result[data.chainId].push(data);
          }
        });
        this.moralisTokenList = {
          ...this.moralisTokenList,
          [this._preferences.getSelectedAddress()]: result,
        };
        this.timeStampList = {
          ...this.timeStampList,
          [this._preferences.getSelectedAddress()]: Date.now(),
        };
        this.hub.emit(
          ASSET_EVENTS.PRICES_UPDATED,
          this.moralisTokenList[this._preferences.getSelectedAddress()],
        );
        this.fullUpdate();
      } catch (e) {
        console.log('moralis error:', e);
      }
    }
  }

  getTokenAndPriceDatas() {
    return this.moralisTokenList[this._preferences.getSelectedAddress()];
  }
}
