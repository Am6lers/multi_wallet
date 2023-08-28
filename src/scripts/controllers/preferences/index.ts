import { ObservableStore } from '@metamask/obs-store';
import { normalize as normalizeAddress } from 'eth-sig-util';
import { ethers } from 'ethers';
import EventEmitter from 'events';
import { cloneDeep, differenceWith, isEqual, orderBy, xor, has } from 'lodash';
import { isHexString } from 'ethereumjs-util';
import Moralis from 'moralis';
import {
  GetWalletNFTsResponseAdapter,
  GetWalletNFTsResponse,
  GetWalletNFTTransfersResponseAdapter,
  GetWalletNFTTransfersResponse,
  EvmNft,
} from 'moralis/common-evm-utils';
import { MoralisDataObjectValue } from 'moralis/common-core';
//@ts-ignore
import abiERC721 from 'human-standard-collectible-abi';
import { ethErrors } from 'eth-rpc-errors';
import { BaseController, BaseConfig, BaseState } from '@metamask/controllers';
import Web3 from 'web3';
import ValidUrl from 'valid-url';
import axios, { Axios, AxiosResponse } from 'axios';
import { Mutex } from 'async-mutex';
// import { CacheManager } from '@lib/image-cache';
import { TOKEN_TYPE } from '../../../types/token';
import CipherMobileNetworkController from '../network';
import { isValidHexAddress } from '@utils/address';
import { parseStringToObject, replaceIpfsUrl } from '@utils/nfts.utils';
import { SECOND } from '@constants/app';
import {
  getBifrostExplorerUrl,
  getRouteBifrostTokenBalancesNft,
} from '@scripts/utils/preferences.util';
import {
  BIFROST_CHAIN_ID,
  BIFROST_TEST_CHAIN_ID,
  NFT_SUPPORTED_MAINNET_CHAIN_IDS,
} from '@constants/network';
import BigNumber from 'bignumber.js';
import {
  defaultInvisibleCoin,
  TEMPORARY_DEFAULT_NFT_IMAGES,
} from '../../../constants/asset';
import {
  BtcMainnetTokenInfo,
  BtcToken,
  EthToken,
  getTokenType,
} from '../../../types/token';
import Constants from '@constants/app';
import { defaultPreferencesState } from './utils';

axios.defaults.withCredentials = true;

export interface FrequentRpc {
  rpcUrl: string;
  chainId?: string;
  nickname?: string;
  ticker?: string;
  rpcPrefs?: RpcPreferences;
}

export interface RpcPreferences {
  blockExplorerUrl: string;
}

export interface AccountToken {
  [chainId: string]: EthToken[];
}

export interface AccountTokens {
  [accountKey: string]: AccountToken;
}

export interface AddressEntry {
  evm?: string | null;
  btc?: string | null;
}

export interface ContactEntry {
  address: AddressEntry;
  name: string;
  importTime?: number;
  img?: string;
  imgNftInfo?: {
    chainId: string;
    tokenAddress: string;
    id: string;
  };
}

export interface FcmData {
  fcmRegistered: boolean;
  registerTimeStamp: Date;
}

export interface EvmNftCustomed extends EvmNft {
  metadata: MoralisDataObjectValue | undefined | any;
}

export interface AccountAssetInfo {
  totalAsset: string;
}

export interface Preferences {
  hideZeroBalanceTokens?: boolean;
  showFiatInTestnets?: boolean;
  useNativeCurrencyAsPrimaryCurrency?: boolean;
}

export interface Identities {
  [address: string]: ContactEntry;
}

export interface PreferencesState extends BaseState {
  identities: Identities;
  lostIdentities: { [address: string]: ContactEntry };
  selectedAccountKey: string;
  selectedAddress: string;
  selectedBtcAddress: string;
  currencyType: string;
  accountTokens?: AccountTokens;
  name?: string;
}

const ERC721_INTERFACE_ID = '0x80ac58cd';
const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

export const PREFERENCES_EVENTS = {
  ACCOUNT_CHANGED: 'accountChanged',
  ACCOUNT_ADDED: 'accountAdded',
  TOKENS_CHANGED: 'tokensChanged',
  VISIBILITY_CHANGED: 'visibilityChanged',
  CURRENCY_TYPE_CHANGED: 'currencyTypeChanged',
  ACCOUNT_LABEL_CHANGED: 'account label changed',
  CHANGE_USE_TESTNETWORK: 'change use testnetwork',
  UPDATE_ACCOUNT_NFT_LIST: 'updateAccountNftList',
  CHANGE_HOME_CHAIN_ID: 'changeHomeChainId',
  CALL_ACCOUNT_NFT: 'callAccountNft',
};

/**
 * cipher에 대해 사용자가 구성할 수 있는 계정설정을 관리합니다.
 */

export default class CipherPreferencesController extends BaseController<
  BaseConfig,
  PreferencesState
> {
  name = 'PreferencesController';

  public store: any;
  public randomArray: Array<number>;
  network: CipherMobileNetworkController;

  hub = new EventEmitter();

  private mutex = new Mutex();

  constructor({
    initState,
    network,
  }: {
    initState: PreferencesState | undefined;
    network: CipherMobileNetworkController;
  }) {
    const defaultInitState: PreferencesState = Object.assign(
      defaultPreferencesState,
      initState ?? {},
    );
    super(undefined, defaultInitState);
    this.network = network;
    this.store = new ObservableStore(defaultInitState);
    this.store.setMaxListeners(30);
    this.randomArray = [];
    this.initialize();
    this.fullUpdate();
  }

  public addToRandomArray(item: any) {
    this.randomArray.push(item);
  }

  public getRandomArray() {
    return this.randomArray;
  }
  public fullUpdate() {
    this.update(this.store.getState());
    return this.store.getState();
  }

  public resetState() {
    this.store.update(defaultPreferencesState);
    this.update(defaultPreferencesState);
  }

  private _getDataIncludeAddress(oldData: Identities, address: string) {
    const addresses = this._getSplitedKey(address);
    const filteredKey = Object.keys(oldData).filter(
      key =>
        (addresses.evm && key.indexOf(addresses.evm) > -1) ||
        (addresses.btc && key.indexOf(addresses.btc) > -1),
    );
    return filteredKey.length > 0 ? oldData[filteredKey[0]] : {};
  }

  public setAddresses(keys: string[]) {
    const oldIdentities = cloneDeep(this.store.getState().identities);

    const oldAccountTokens = cloneDeep(this.store.getState().accountTokens);
    const updateStateDefault: {
      accountTokens: AccountTokens;
      identities: Identities;
    } = { identities: {}, accountTokens: {} };

    const updateStateValue = keys.reduce((state, key, index) => {
      const oldId = this._getDataIncludeAddress(oldIdentities, key);
      const oldTokens = this._getDataIncludeAddress(
        oldAccountTokens,
        key,
      ) as AccountToken;
      state.identities[key] = Object.assign(oldId, {
        name: (oldId as ContactEntry)?.name || `Account ${index + 1}`,
        address: this._getSplitedKey(key),
      });
      state.accountTokens[key] = oldTokens;
      return state;
    }, updateStateDefault);
    this.update(updateStateValue);
    this.store.updateState(updateStateValue);
    this.hub.emit(PREFERENCES_EVENTS.ACCOUNT_ADDED, true);
  }

  public setAccountLabel(key: string, label: string) {
    let accountKey: string | null = key;
    if (!key) {
      accountKey = this._getAccountKeyIncludeAddress(key);
      if (!accountKey) {
        throw new Error(
          `setAccountLabel requires a valid address, got ${String(accountKey)}`,
        );
      }
    }
    const { identities } = this.store.getState();
    const cloneIdentities = cloneDeep(identities);
    cloneIdentities[accountKey] = cloneIdentities[accountKey] || {};
    cloneIdentities[accountKey].name = label;
    const newState = { identities: cloneIdentities };
    this.update(newState);
    this.store.updateState(newState);
    this.hub.emit(PREFERENCES_EVENTS.ACCOUNT_LABEL_CHANGED, accountKey);
    return Promise.resolve(label);
  }

  private _getAccountKeyIncludeAddress(address: string) {
    const { identities } = this.store.getState();
    const matchedKeys = Object.keys(identities).filter(
      key => key.indexOf(address) > -1,
    );
    return matchedKeys.length ? matchedKeys[0] : null;
  }

  private _getSplitedKey(address: string) {
    const resKey: { evm: string | null; btc: string | null } = {
      evm: null,
      btc: null,
    };
    return address.split('/').reduce((res, addr, i) => {
      if (i === 0 && addr) {
        res.evm = addr;
      } else if (i === 1 && addr) {
        res.btc = addr;
      }
      return res;
    }, resKey);
  }

  public setSelectedAddress(key: string) {
    const accountKey: string | null = this._getAccountKeyIncludeAddress(key);
    if (!accountKey) {
      throw new Error(`Identity for '${key} not found`);
    }
    const { identities, tokens } = this.store.getState();
    const addresses = cloneDeep(this._getSplitedKey(accountKey));
    if (!identities[accountKey]) {
      throw new Error(`Identity for '${accountKey} not found`);
    }

    identities[accountKey].lastSelected = Date.now();
    const newState = {
      identities,
      selectedAccountKey: accountKey,
      selectedAddress: addresses.evm ?? '',
      selectedBtcAddress: addresses.btc ?? '',
    };
    this.update(newState);
    this.store.updateState(newState);
    setTimeout(() => {
      this.hub.emit(PREFERENCES_EVENTS.ACCOUNT_CHANGED, {
        selectedAddress: addresses.evm ?? '',
        selectedBtcAddress: addresses.btc ?? '',
      });
    }, 0);
    return Promise.resolve(tokens);
  }

  public removeAddress(key: string) {
    const { identities, accountTokens } = this.store.getState();
    const cloneIdentities = cloneDeep(identities);
    const cloneAccountTokens = cloneDeep(accountTokens);
    let accountKey: string | null = key;
    if (!cloneIdentities[accountKey]) {
      accountKey = this._getAccountKeyIncludeAddress(key);
      if (!accountKey) {
        throw new Error(
          `${accountKey} can't be deleted cause it was not found`,
        );
      }
    }
    delete cloneIdentities[accountKey];
    delete cloneAccountTokens[accountKey];
    const newState = {
      identities: cloneIdentities,
      accountTokens: cloneAccountTokens,
    };
    this.update(newState);
    this.store.updateState(newState);

    if (accountKey === this.getSelectedAccountKey()) {
      const newIdentities = newState.identities;
      const selectedKey = Object.keys(newIdentities)[0];
      if (selectedKey) {
        this.setSelectedAddress(selectedKey);
      }
    }
    return key;
  }

  public getSelectedAccountKey() {
    return this.store.getState().selectedAccountKey;
  }

  public getSelectedAddress() {
    return this.store.getState().selectedAddress;
  }

  public getSelectedBtcAddress() {
    return this.store.getState().selectedBtcAddress;
  }

  public getIdentities() {
    return this.store.getState().identities;
  }

  public getSelectedIdentity() {
    const { identities } = this.store.getState();
    return identities[this.getSelectedAccountKey()];
  }
}
