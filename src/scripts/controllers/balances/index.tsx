import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import CipherKeyringController from '../keyring/cipherKeyringController';
import CipherPreferencesController, {
  PREFERENCES_EVENTS,
} from '../preferences';
import Web3 from 'web3';
import { getAddressBalances } from 'eth-balance-checker/lib/web3';
import CipherMobileNetworkController from '../network';
import { getContractAddress } from './lib/utils';
import { BalanceMap } from 'eth-balance-checker/lib/common';
import EventEmitter from 'events';
import { AccountAssetController, Asset, MoralisToken } from '../accountAsset';
import {
  EvmNft,
  GetWalletNFTsResponseAdapter,
} from '@moralisweb3/common-evm-utils';
import Moralis from 'moralis/.';
import BigNumber from 'bignumber.js';

export const B_TRACKER_EVENTS = {
  BALANCES_UPDATED: 'balancesUpdate',
  NFTS_UPDATE: 'nftsUpdate',
  UPDATE_ERROR: 'updateError',
  UPDATE_BALANCES: 'updateBalances',
};

interface Proviers {
  [chainId: string]: Web3;
}

interface AccountData {
  address: string;
  accountKey: string;
}

interface DumyTokenInfos {
  [chainId: string]: any[];
}

export interface BalancesData {
  [chainId: string]: BalanceMap;
}

interface AddressesBalances {
  [address: string]: BalancesData;
}

interface AddressesNfts {
  [address: string]: EvmNft[];
}

interface Token {
  address: string;
  decimals: number;
  image: string;
  iconUrl: string;
  symbol: string;
  name: string;
  chainId: string;
}

export interface TokenData {
  token: Token | MoralisToken;
  balance: string;
}

export interface BalanceTrackerState extends BaseState {
  addressesBalances: AddressesBalances;
  addressesNfts: AddressesNfts;
}

export interface BalanceTrackerOpts {
  initState: BalanceTrackerState | undefined;
  keyringController: CipherKeyringController;
  preferencesController: CipherPreferencesController;
  networkController: CipherMobileNetworkController;
  accountAssetController: AccountAssetController;
}

export default class BalanceTrackingController extends BaseController<
  BaseConfig,
  BalanceTrackerState
> {
  name = 'BalanceTrackingController';
  private selectedAccount: AccountData;
  private activatedTokensByAddr: {
    [chainId: string]: Asset[];
  };
  private preferences: CipherPreferencesController;
  private keyrings: CipherKeyringController;
  private network: CipherMobileNetworkController;
  private providers: Proviers;
  private _account: AccountAssetController;
  private addressesBalances: AddressesBalances;
  private addressesNfts: AddressesNfts;
  private intervalId: NodeJS.Timeout | undefined;

  hub = new EventEmitter();

  constructor(opts: BalanceTrackerOpts) {
    super(undefined, opts.initState ?? {});
    this.preferences = opts.preferencesController;
    this.keyrings = opts.keyringController;
    this.network = opts.networkController;
    this._account = opts.accountAssetController;
    this.providers = this.network?.getWeb3Providers();
    this.selectedAccount = {
      address: this.preferences.getSelectedAddress(),
      accountKey: this.preferences.getSelectedAccountKey(),
    };
    this.addressesBalances = opts.initState?.addressesBalances ?? {};
    this.addressesNfts = opts.initState?.addressesNfts ?? {};
    this.activatedTokensByAddr = this._account.getActivatedAssets();
    this.preferences.hub.on(
      PREFERENCES_EVENTS.ACCOUNT_CHANGED,
      this.accountChanged.bind(this),
    );
    this.hub.on(
      B_TRACKER_EVENTS.UPDATE_BALANCES,
      this.startBalancesTracking.bind(this),
    );
    this.initialize();
  }

  accountChanged() {
    this.selectedAccount = {
      address: this.preferences.getSelectedAddress(),
      accountKey: this.preferences.getSelectedAccountKey(),
    };
    this.activatedTokensByAddr = this._account.getActivatedAssets();
    this.startBalancesTracking();
  }

  async updateBalances() {
    try {
      if (!this.providers) {
        throw new Error('ChainAccountTracker - web3 provider undefined');
      }
      const selectedAddress = this.selectedAccount.address;
      //@ts-ignore
      const tokenInfos: DumyTokenInfos = this.activatedTokensByAddr;
      const result = await Promise.all(
        Object.entries(tokenInfos).map(async ([chainId, tokenInfo]) => {
          let options = {
            contractAddress: getContractAddress(chainId),
          };

          const chainTokenList = tokenInfo.map((token: any) =>
            token.address.toLowerCase(),
          );
          const provider = this.providers?.[chainId];
          try {
            const balances = await getAddressBalances(
              provider,
              selectedAddress,
              chainTokenList,
              options,
            );
            return { [chainId]: balances };
          } catch (e) {
            let zeroBalances: BalanceMap = {};
            chainTokenList.forEach((token: string) => {
              zeroBalances[token] = '0';
            });
            return { [chainId]: zeroBalances };
          }
        }),
      );
      const balancesData: BalancesData = Object.assign({}, ...result);
      this.addressesBalances[selectedAddress] = balancesData;
      this.update({
        ...this.state,
        addressesBalances: this.addressesBalances,
      });
      this.hub.emit(B_TRACKER_EVENTS.BALANCES_UPDATED, balancesData);
    } catch (e) {
      console.warn('error', e);
      this.hub.emit(B_TRACKER_EVENTS.UPDATE_ERROR, e);
    }
  }

  async updateNftList() {
    try {
      const nftsResponse: GetWalletNFTsResponseAdapter =
        await Moralis.EvmApi.nft.getWalletNFTs({
          chain: '0x5',
          address: this.preferences.getSelectedAddress(),
        });
      (this.addressesNfts[this.selectedAccount.address] = nftsResponse.result),
        this.update({
          ...this.state,
          addressesNfts: this.addressesNfts,
        });
      this.hub.emit(B_TRACKER_EVENTS.NFTS_UPDATE, nftsResponse.result);
    } catch (e) {
      console.warn('error', e);
      this.hub.emit(B_TRACKER_EVENTS.UPDATE_ERROR, e);
    }
  }

  async startBalancesTracking() {
    Promise.all([this.updateBalances(), this.updateNftList()]);
  }

  getAddressesBalances() {
    return this.addressesBalances[this.selectedAccount.address];
  }

  async getTotalTokenData() {
    const balanceData = this.getAddressesBalances();
    const tokenPriceData = this._account.getTokenAndPriceDatas();
    const data = (await Promise.all(
      Object.entries(balanceData)?.map(async ([chainId, balances]) => {
        const contract = Object.keys(balances)?.[0];
        const token = (
          await this._account.getTokensByAddrAndChainId(contract, chainId)
        )?.[0] as Token;
        if (token) {
          const decimals = new BigNumber(10).pow(token.decimals);
          const bigBalance = new BigNumber(balances[contract]);
          const balance = bigBalance.isGreaterThan(0)
            ? new BigNumber(balances[contract]).dividedBy(decimals).toFixed(6)
            : '0';
          const moralisToken = tokenPriceData[chainId].find(
            value => value.tokenAddress.toLowerCase() === contract,
          );
          const holdPrice = moralisToken?.usdPrice.multipliedBy(balance);
          return {
            token: {
              ...moralisToken,
              tokenLogo: moralisToken?.tokenLogo ?? token.image,
            },
            balance: balance,
            price: holdPrice?.isGreaterThan(0) ? holdPrice.toFixed(2) : '0',
          };
        }
        return {
          token: undefined,
          balance: '0',
          price: '0',
        };
      }),
    )) as TokenData[];
    return data;
  }
}
