import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import CipherKeyringController from '../keyring/cipherKeyringController';
import CipherPreferencesController from '../preferences';
import Web3 from 'web3';
import { getAddressBalances } from 'eth-balance-checker/lib/web3';
import CipherMobileNetworkController from '../network';
import { getContractAddress } from './lib/utils';
import { BalanceMap } from 'eth-balance-checker/lib/common';

interface ActivateTokens {
  [key: string]: string[];
}

interface Proviers {
  [chainId: string]: Web3;
}

interface BalancesData {
  [chainId: string]: BalanceMap;
}

export interface BalanceTrackerState extends BaseState {
  activatedTokensByAddr: ActivateTokens;
}

export interface BalanceTrackerOpts {
  initState: BalanceTrackerState | undefined;
  keyringController: CipherKeyringController;
  preferencesController: CipherPreferencesController;
  networkController: CipherMobileNetworkController;
}

export default class BalanceTrackingController extends BaseController<
  BaseConfig,
  BalanceTrackerState
> {
  private seletedAddress: string;
  private activatedTokensByAddr: ActivateTokens;
  private preferences: CipherPreferencesController;
  private keyrings: CipherKeyringController;
  private network: CipherMobileNetworkController;
  private providers: Proviers;

  constructor(opts: BalanceTrackerOpts) {
    super(undefined, opts.initState ?? {});
    this.preferences = opts.preferencesController;
    this.keyrings = opts.keyringController;
    this.network = opts.networkController;
    this.providers = this.network?.getWeb3Providers();
    this.seletedAddress = this.preferences.getSelectedAddress();
    this.activatedTokensByAddr = opts.initState?.activatedTokensByAddr ?? {};
  }

  async updateBalances() {
    try {
      if (!this.providers) {
        throw new Error('ChainAccountTracker - web3 provider undefined');
      }
      const result = await Promise.all(
        Object.entries(this.providers).map(async ([chainId, provider]) => {
          let options = {
            contractAddress: getContractAddress(chainId),
          };
          const balances = await getAddressBalances(
            provider,
            this.seletedAddress,
            this.activatedTokensByAddr?.[this.seletedAddress],
            options,
          );
          return { [chainId]: balances };
        }),
      );
      const balancesData = Object.assign({}, ...result);
    } catch (e) {}
  }
}
