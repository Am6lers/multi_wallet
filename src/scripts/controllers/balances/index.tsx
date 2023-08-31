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
import { AccountAssetController, Asset } from '../accountAsset';

export const B_TRACKER_EVENTS = {
  BALANCES_UPDATE: 'balancesUpdate',
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

export interface BalanceTrackerState extends BaseState {
  addressesBalances: AddressesBalances;
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
    this.activatedTokensByAddr = this._account.getActivatedAssets(
      this.selectedAccount.address,
    );

    this.preferences.hub.on(
      PREFERENCES_EVENTS.ACCOUNT_CHANGED,
      this.accountChanged.bind(this),
    );
    this.initialize();
  }

  accountChanged() {
    this.selectedAccount = {
      address: this.preferences.getSelectedAddress(),
      accountKey: this.preferences.getSelectedAccountKey(),
    };
    this.activatedTokensByAddr = this._account.getActivatedAssets(
      this.selectedAccount.address,
    );
    this.startPolling.bind(this)();
  }

  async updateBalances() {
    try {
      if (!this.providers) {
        throw new Error('ChainAccountTracker - web3 provider undefined');
      }
      const selectedAddress = this.selectedAccount.address;
      //@ts-ignore
      const tokenInfos: DumyTokenInfos = this.activatedTokensByAddr;
      console.log('activatedTokensByAddr', this.activatedTokensByAddr);
      const result = await Promise.all(
        Object.entries(this.providers).map(async ([chainId, provider]) => {
          try {
            let options = {
              contractAddress: getContractAddress(chainId),
            };
            const chainTokenList = tokenInfos?.[chainId].map(
              (token: any) => token.address,
            );
            console.log('balancesData chainTokenList: ', chainTokenList);

            const balances = await getAddressBalances(
              provider,
              selectedAddress,
              chainTokenList,
              options,
            );
            return { [chainId]: balances };
          } catch (e) {
            console.log("Can't get balances", e);
            return { [chainId]: {} };
          }
        }),
      );
      const balancesData: BalancesData = Object.assign({}, ...result);
      this.addressesBalances[selectedAddress] = balancesData;
      this.update({
        addressesBalances: this.addressesBalances,
      });
      console.log('balancesData', balancesData);
      this.hub.emit(B_TRACKER_EVENTS.BALANCES_UPDATE, balancesData);
    } catch (e) {}
  }

  poll() {
    this.intervalId && this.stopPolling();
    this.intervalId = setInterval(() => {
      this.updateBalances();
    }, 60000);
  }

  startPolling() {
    this.updateBalances();
    this.poll();
  }

  stopPolling() {
    clearInterval(this.intervalId!);
    this.intervalId = undefined;
  }
}
