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

export interface AccountAssetState extends BaseState {
  activatedAssetsList: ActivatedAssetList;
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

  constructor(opts: AccountAssetOpts) {
    super(undefined, opts.initState ?? {});
    this._keyrings = opts.keyringController;
    this._preferences = opts.preferencesController;
    this._network = opts.networkController;
    this.activatedAssetsList = opts.initState?.activatedAssetsList ?? {};
    this.initialTokenInfos.bind(this)();
    this._keyrings.hub.on('newAccount', this.setDefaultTokens.bind(this));
    this.initialize();
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
            console.log('tokenList token:', {
              chainId,
              address: token.Address,
              name: token.Name,
              symbol: token.Symbol,
              decimals: token.Decimals,
            });
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
    this.update({
      ...this.state,
      activatedAssetsList: this.activatedAssetsList,
    });
  }

  getActivatedAssets() {
    return this.activatedAssetsList[this._preferences.getSelectedAddress()];
  }
}
