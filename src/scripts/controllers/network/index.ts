import EventEmitter from 'events';
import Web3 from 'web3';
import { ObservableStore, ComposedStore } from '@metamask/obs-store';
// @ts-ignore
import EthQuery from 'eth-query';
import { Mutex } from 'async-mutex';
import { memoize, isEmpty, find, has } from 'lodash';
import { isInfuraUrl } from './../../utils/common';
import fetch from 'node-fetch';
import { AbortController } from 'node-abort-controller';
import {
  MAIN_NETWORKS_MAP,
  MAINNET,
  INFURA_BLOCKED_KEY,
  NETWORKS,
  Network,
} from '@constants/network';
import { isPrefixedFormattedHexString, isSafeChainId } from '@utils/network';
import { BaseController, BaseConfig, BaseState } from '@metamask/controllers';
import { PreferencesState } from '../preferences';
import Web3ProviderEngine from './utils';
import Constants from '@constants/app';

interface NetworkState extends Network {
  rpcPrefs?: any;
}

interface LatestBlockRes {
  baseFeePerGas?: unknown;
  EIPS?: {
    [key: number]: boolean;
  };
}

interface Web3Group {
  [chainId: string]: Web3;
}

interface NetworkDetailsState {
  EIPS?: {
    [key: number]: undefined | boolean;
  };
}

interface NetworkInitState {
  provider?: NetworkState;
  previousProvider?: NetworkState;
  network?: string;
  networkDetails?: NetworkDetailsState;
  isMobile?: boolean;
  activationNetworkManager?: any;
  customRpcTargets?: Record<string, NetworkState>;
}

interface NetworkControllerOpts {
  defaultRpcTargets: {
    [key: string]: NetworkState;
  };
  initState?: NetworkInitState;
}

interface MultiProviderUrls {
  [key: string]: string;
}

type CustomRpcTargets = Record<string, NetworkState>;

export interface BaseProviderParams {
  static: {
    eth_sendTransaction: <Payload>(
      payload: Payload,
      next: any,
      end: any,
    ) => Promise<void>;
  };
  version: string;
  eth_syncing: boolean;
  web3_clientVersion: string;
  getAccounts: (end: any, payload: any) => void;
}

export type NetworkControllerState = BaseState & NetworkInitState;

export default class CipherMobileNetworkController extends BaseController<
  BaseConfig,
  NetworkControllerState
> {
  hub = new EventEmitter();
  name = 'NetworkController';

  public web3Providers: Web3Group = {};
  private _web3RpcEntries: { [chainId: string]: string } = {};
  private _defaultRpcTargets: { [key: string]: NetworkState } = {};
  private _customRpcTargets: CustomRpcTargets = {};

  private mutex = new Mutex();
  constructor(opts: NetworkControllerOpts = { defaultRpcTargets: {} }) {
    const initState = opts.initState || {};
    super(undefined, initState);
    this._defaultRpcTargets = opts.defaultRpcTargets;
    this._customRpcTargets = opts.initState?.customRpcTargets || {};
    Object.keys(opts.defaultRpcTargets).forEach((key: string) => {
      if (
        !opts.defaultRpcTargets[key] ||
        typeof opts.defaultRpcTargets[key] !== 'object'
      ) {
        return;
      }
    });

    this.syncWeb3Providers.bind(this)();
    this.initialize();
  }
  getPermittedRpcTargets(): { [key: string]: string } {
    try {
      if (isEmpty(this._defaultRpcTargets)) {
        throw new Error(
          'CipherNetworkController - _configureMultiProvider - empty urls',
        );
      }
      const multiProviderUrls: MultiProviderUrls = {};
      const customRpcTargets = this._customRpcTargets;
      const customRpcTargetsKeys = customRpcTargets
        ? Object.keys(customRpcTargets)
        : [];
      Object.keys(this._defaultRpcTargets).forEach((key: string) => {
        const target = this._defaultRpcTargets[key];
        if (typeof target.rpcTarget === 'string') {
          multiProviderUrls[target.chainId] = target.rpcTarget;
        }
      });
      customRpcTargetsKeys.forEach((key: string) => {
        const target = customRpcTargets[key];
        if (typeof target.rpcTarget === 'string') {
          multiProviderUrls[target.chainId] = target.rpcTarget;
        }
      });
      return multiProviderUrls;
    } catch (e) {
      // Logger.error(
      //   e,
      //   'BiportMobileNetworkController - getPermittedRpcTargets:',
      // );
      return {};
    }
  }

  // setting and sync web3 providers
  syncWeb3Providers() {
    this._web3RpcEntries = this.getPermittedRpcTargets() ?? {};
    if (isEmpty(this.web3Providers)) {
      this.web3Providers = Object.entries(this._web3RpcEntries).reduce(
        (acc, [chainId, rpcTarget]) => {
          acc[chainId] = new Web3(new Web3.providers.HttpProvider(rpcTarget));
          return acc;
        },
        {} as Web3Group,
      );
    } else {
      // Object.entries(this._web3RpcEntries).forEach(([chainId, rpcTarget]) => {
      //   const currProvider = this.web3Providers[chainId];
      //   if (
      //     !currProvider ||
      //     !(currProvider instanceof Web3)
      //     // || currProvider.givenProvider !== rpcTarget
      //   ) {
      //     this.web3Providers[chainId] = new Web3(
      //       new Web3.providers.HttpProvider(rpcTarget),
      //     );
      //   }
      // });
    }
  }

  // return web3 provider
  getWeb3Provider(chainId: string) {
    // if (this.web3Providers && chainId && has(this.web3Providers, [chainId])) {
    //   return this.web3Providers[chainId];
    // } else {
    //   return new Web3();
    // }
  }

  //return web3 providers
  getWeb3Providers() {
    return this.web3Providers;
  }

  getDefaultNetworks(useNetwork?: 'mainnet' | 'testnet'): NetworkState[] {
    // const networks = Object.values(NETWORKS);
    // if (useNetwork && useNetwork === 'mainnet') {
    //   // return networks.filter(network => !network?.isTest || network.chainId === '0xbfc0');
    //   return networks.filter(network => !network?.isTest);
    // }
    // if (useNetwork && useNetwork === 'testnet') {
    //   // return networks.filter(network => network?.isTest && network.chainId !== '0xbfc0');
    //   return networks.filter(network => network?.isTest);
    // }
    // return networks;
  }

  getNetworkByChainId(chainId: string): NetworkState | null {
    // const defaultNetworks = this.getDefaultNetworks();
    // const network = find(defaultNetworks, { chainId });
    // if (network) {
    //   return network;
    // }
    // // const customRpcTargets =
    // //   this._getState<CustomRpcTargets>('customRpcTargets') || {};
    // // if (customRpcTargets[chainId]) {
    // //   return customRpcTargets[chainId];
    // // }
    // return null;
  }
}
