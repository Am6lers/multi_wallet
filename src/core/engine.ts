import { EncryptionControlState } from '../scripts/controllers/encryption/index';
import {
  ComposableController,
  ControllerMessenger,
  BaseController,
} from '@metamask/controllers';
import MultiKeyringController, {
  BTC_KEY,
  EVM_KEY,
} from '@scripts/controllers/keyring/multiKeyringController';
import { KeyringState } from '@scripts/controllers/keyring/multiKeyringController';
import MobileTransactionController, {
  TransactionState,
  AddTxOpts,
} from '@scripts/controllers/transaction/index';
import * as bip39 from 'bip39';

import Encryptor from './Encryptor';
import { store } from '../store';
import { cloneDeep } from 'lodash';
import Web3 from 'web3';
// import Logger from './../common/Logger';
import EncryptionController from '@scripts/controllers/encryption';
import { Mutex } from 'await-semaphore';
import {
  PrivateKeys,
  TYPE_SIMPLE_KEY_PAIR,
} from '~/scripts/controllers/keyring/types';

const encryptor = new Encryptor();
let currentChainId: any;

export interface EngineContext {
  KeyringController: MultiKeyringController;
  // TransactionController: MobileTransactionController;
  // ApprovalController: ApprovalController;
  EncryptionController?: EncryptionController;
}

export type EngineInitState = {
  KeyringController?: KeyringState | undefined;
  // TransactionController?: TransactionState | undefined;
  // ApprovalController?: ApprovalControllerState | undefined;
  EncryptionController?: EncryptionControlState | undefined;
};

export type EngineContextNames = keyof EngineContext;

export type InitStateNames = keyof EngineInitState;

export type Controllers = [
  MultiKeyringController,
  // PhishingController,
  // MobileTransactionController,
  // ApprovalController,
  EncryptionController,
];

export const controllerNames: EngineContextNames[] = [
  'KeyringController',
  // 'TransactionController',
  // 'ApprovalController',
  'EncryptionController',
];

interface SyncParams {
  accounts: KeyringState;
  transactions: TransactionState;
  seed: string;
  pass: string;
}

/**
 * Core controller responsible for composing other controllers together
 * and exposing convenience methods for common wallet operations.
 * 다른 컨트롤러를 함께 구성하고 일반적인 지갑 작업을 위한 편리한 방법을 제공하는 역할을 하는 핵심 컨트롤러입니다.
 */
class Engine {
  /**
   * ComposableController reference containing all child controllers
   */
  datamodel;
  static instance: Engine | undefined;
  context: EngineContext = {
    KeyringController: {} as MultiKeyringController,
    // TransactionController: {} as MobileTransactionController,
    // ApprovalController: {} as ApprovalController,
    EncryptionController: {} as EncryptionController,
  };

  /**
   * Object containing the info for the latest incoming tx block
   * for each address and network
   */
  lastIncomingTxBlockInfo: any;
  controllerMessenger: ControllerMessenger<any, any> | undefined;
  createVaultMutex = new Mutex();
  /**
   * Creates a CoreController instance
   */
  constructor(initialState: EngineInitState = {}) {
    if (!Engine.instance) {
      const keyringController = new MultiKeyringController({
        initState: initialState?.KeyringController ?? undefined,
        encryptor: encryptor,
        isTest: false,
      });

      // const transactionController = new MobileTransactionController({
      //   getNetworkState: () => networkController.getProviderConfig(),
      //   onNetworkStateChange: (listener: Listener<NetworkControllerState>) =>
      //     networkController.subscribe(listener),
      //   getProvider: () =>
      //     networkController.getProviderAndBlockTracker().provider,
      //   getNetworkByChainId:
      //     networkController.getNetworkByChainId.bind(networkController),
      //   preferencesController,
      // });

      const encryptionController = new EncryptionController({
        initState: initialState.EncryptionController,
        keyringController: keyringController,
        encryptor: encryptor,
      });

      const controllers: Controllers = [
        keyringController,
        // new PhishingController(),
        // new ApprovalController({
        //   messenger: this.controllerMessenger.getRestricted({
        //     name: 'ApprovalController',
        //   }),
        //   showApprovalRequest: () => undefined,
        // }),
        encryptionController,
      ];
      // set initial state
      // TODO: Pass initial state into each controller constructor instead
      // This is being set post-construction for now to ensure it's functionally equivalent with
      // how the `ComponsedController` used to set initial state.
      //
      // The check for `controller.subscribe !== undefined` is to filter out BaseControllerV2
      // controllers. They should be initialized via the constructor instead.

      for (const controller of controllers) {
        if (
          initialState &&
          controller.subscribe !== undefined &&
          controller instanceof BaseController
        ) {
          const controllerInitState = initialState[
            controller.name as InitStateNames
          ] as any;
          if (controllerInitState) {
            controller.update(controllerInitState ?? undefined);
          }
        }
      }
      // for (const controller of controllers) {
      //   if (
      //     initialState[controller.name] &&
      //     controller.subscribe !== undefined
      //   ) {
      //     controller.update(initialState[controller.name]);
      //   }
      // }
      this.datamodel = new ComposableController(
        controllers,
        this.controllerMessenger as any,
      );

      this.context = {
        KeyringController: controllers[0],
        EncryptionController: controllers[1],
      };

      // this.context = controllers.reduce((context, controller) => {
      //   context[controller.name] = controller;
      //   return context;
      // }, {});

      this.context.KeyringController.hub.on('unlock', () => {
        // logEventLogin();
      });
      // this.configureControllersOnNetworkChange();
      this.startPolling();
      Engine.instance = this;
    }
    return Engine.instance;
  }

  startPolling() {
    // const {
    //   CollectibleDetectionController,
    //   TokenDetectionController,
    //   TokenListController,
    // } = this.context;
    // TokenListController.start();
    // CollectibleDetectionController.start();
    // TokenDetectionController.start();
  }

  refreshTransactionHistory = async (forceCheck: boolean) => {
    try {
      return forceCheck;
    } catch (e) {
      // Logger.log('Error while fetching all txs', e);
    }
  };

  getTotalFiatAccountBalance = () => {};

  /**
   * Returns true or false whether the user has funds or not
   */
  hasFunds = () => {};

  resetState = async () => {
    // Whenever we are gonna start a new wallet
    // either imported or created, we need to
    // get rid of the old data from state
    // const {
    //   TransactionController,
    //   TokenBalancesController,
    //   TokenRatesController,
    // } = this.context;

    try {
      // const { TransactionController } = this.context;
      // //Clear assets info
      // TransactionController.update({
      //   methodData: {},
      //   transactions: [],
      // });
    } catch (e) {
      return;
    }
  };

  importAccountWithSeed = async (mnemonic: string, isNewWallet?: boolean) => {
    try {
      const { KeyringController } = this.context;

      // const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
      const addresses = await KeyringController.importAccountWithSeed(mnemonic);
      const allAccountsAfterAdded =
        await KeyringController.getSerializedAccounts();
      const addedAddress =
        allAccountsAfterAdded[allAccountsAfterAdded.length - 1];

      let nativeBalances: Record<string, any> = {};
      if (isNewWallet) {
        // await logAccountEvent({
        //   time: new Date().toISOString(),
        //   accountAddress: PreferencesController.getSelectedAddress(),
        //   content_type: GAEventContentType.CreateWallet,
        // });
      } else {
        // await logAccountEvent({
        //   ...nativeBalances,
        //   time: new Date().toISOString(),
        //   accountAddress: PreferencesController.getSelectedAddress(),
        //   content_type: GAEventContentType.ImportWallet,
        //   import_type: 'Mnemonic'
        // });
      }
      if (addresses.evm) {
        const keyring = await KeyringController.getKeyringForAccount(
          addresses.evm,
        );
        return keyring.id;
      }
      return '';
    } catch (e) {
      return Promise.resolve(false);
    }
  };

  // changeSimpleKeyToMultiWallet = async ({
  //   mnemonic,
  //   addresses,
  //   walletName,
  //   hdPath,
  // }: {
  //   mnemonic: string;
  //   addresses: Addresses;
  //   walletName: string;
  //   hdPath?: { [key: string]: HdPathOpts };
  // }) => {
  //   const { KeyringController, PreferencesController } = this.context;
  //   const keyring = await KeyringController.replaceSimpleKeyAccountToHDWallet({
  //     mnemonic,
  //     privateKeys: addresses,
  //     hdPath,
  //   });
  //   const oldKey = addressesObjectToString(addresses);
  //   const newAccounts = keyring.getAccounts();
  //   const newKey = addressesObjectToString(newAccounts);
  //   const isReplaced = PreferencesController.replaceIdentitiesAndTokensKey(
  //     oldKey,
  //     newKey,
  //   );
  //   if (!isReplaced) {
  //     return false;
  //   }
  //   await PreferencesController.setAccountLabel(newKey, walletName);
  //   PreferencesController.setAccountImage({
  //     key: newKey,
  //   });
  //   return keyring.id;
  // };

  createNewVaultAndRestore = async (password: string, seed: string) => {
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      const { KeyringController } = this.context;

      let accountKeys;
      // clear known identities
      // PreferencesController.setAddresses([]);
      // permissionsController.clearPermissions();
      // accountTracker.clearAccounts();
      // cachedBalancesController.clearCachedBalances();
      // txController.txStateManager.clearUnapprovedTxs();

      // create new vault
      const vault = await KeyringController.createNewVaultAndRestore(
        password,
        seed,
      );
      accountKeys = await KeyringController.getSerializedAccounts();

      const primaryKeyring =
        KeyringController.getKeyringsByType('HD Key Tree')[0];
      if (!primaryKeyring) {
        throw new Error('MetamaskController - No HD Key Tree found');
      }
      // set new identities;

      // await logAccountEvent({
      //   time: new Date().toISOString(),
      //   accountAddress: PreferencesController.getSelectedAddress(),
      //   content_type: GAEventContentType.CreateWallet,
      // });

      return vault;
    } finally {
      releaseLock();
    }
  };

  importAccountWithStrategy = async (
    privateKeys: PrivateKeys,
    masterId?: string,
    numberOfChildAccounts?: number,
    // hdPath?: { [key: string]: HdPathOpts },
  ) => {
    const evmPrivateKey = privateKeys.evm || null;
    const btcPrivateKey = privateKeys.btc || null;
    if (!evmPrivateKey && !btcPrivateKey) {
      throw new Error('Cannot import an empty key.');
    }
    const { KeyringController } = this.context;

    const keyring = await KeyringController.addNewKeyring({
      //@ts-ignore
      type: 'Simple Key Pair',
      privateKeys: {
        evm: evmPrivateKey,
        btc: btcPrivateKey,
      },
      masterId,
      isTest: false,
      numberOfDeriven: numberOfChildAccounts,
      // hdPath,
    });

    // await logAccountEvent({
    //   ...nativeBalances,
    //   time: new Date().toISOString(),
    //   accountAddress: PreferencesController.getSelectedAddress(),
    //   content_type: GAEventContentType.ImportWallet,
    //   import_type: 'PrivateKey',
    // });
  };

  createNewVaultAndRestoreByPrivateKey = async (
    password: string,
    privateKeys: PrivateKeys,
    walletName: string,
  ) => {
    const evmPrivateKey = privateKeys.evm || null;
    const btcPrivateKey = privateKeys.btc || null;
    if (typeof password !== 'string') {
      return Promise.reject(new Error('Password must be text.'));
    }
    if (!evmPrivateKey && !btcPrivateKey) {
      throw new Error('Cannot import an empty key.');
    }
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      const { KeyringController } = this.context;

      let accountsKeys;

      KeyringController.clearKeyrings();

      const vault =
        await KeyringController.createNewVaultAndRestoreByPrivateKeys(
          password,
          {
            evm: evmPrivateKey,
            btc: btcPrivateKey,
          },
        );

      accountsKeys = await KeyringController.getSerializedAccounts();

      // set new identities

      // await logAccountEvent({
      //   ...nativeBalances,
      //   time: new Date().toISOString(),
      //   accountAddress: PreferencesController.getSelectedAddress(),
      //   content_type: GAEventContentType.ImportWallet,
      //   import_type: 'PrivateKey'
      // });

      return vault;
    } finally {
      releaseLock();
    }
  };

  createNewVaultAndKeychain = async (password: string) => {
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      const { KeyringController } = this.context;

      let vault;
      const accounts = await KeyringController.getAccounts();
      if (accounts[EVM_KEY].length > 0 || accounts[BTC_KEY].length > 0) {
        vault = await KeyringController.fullUpdate();
      } else {
        vault = await KeyringController.createNewVaultAndKeychain(password);
        const keys = await KeyringController.getSerializedAccounts();
      }
      return vault;
    } finally {
      releaseLock();
    }
  };

  removeWallet = async (privateKeys: PrivateKeys) => {
    const { KeyringController } = this.context;

    const evm = privateKeys[EVM_KEY] || '';
    const btc = privateKeys[BTC_KEY] || '';
    const addresses = `${evm}/${btc}`;

    try {
      await KeyringController.removeAccount(evm.toLocaleLowerCase());
    } catch (e) {
      return new Promise((_, reject) => {
        reject(new Error(`${e}`));
      });
    }
  };

  // addAdditionalAccount = async (masterId: string, walletName: string) => {
  //   // {addresses: account, status: 'NEW'}
  //   const { KeyringController } = this.context;

  //   const account = await KeyringController.addAdditionalAccount(masterId);
  //   if (account.status === 'DUPLICATE') {
  //     return Promise.resolve(account);
  //   } else {
  //     const accountKey = addressesObjectToString(account.addresses);
  //     const allAccounts = await KeyringController.getSerializedAccounts();
  //     await PreferencesController.setAddresses(allAccounts);
  //     await PreferencesController.setAccountLabel(accountKey, walletName);
  //     PreferencesController.setAccountImage({
  //       key: accountKey,
  //       keyringList: allAccounts,
  //     });
  //     await this.setNativeTokensWithNewWallet(
  //       allAccounts.filter(
  //         key => key.toLowerCase() === accountKey.toLowerCase(),
  //       ),
  //     );
  //     await PreferencesController.setSelectedAddress(accountKey);
  //     return account.addresses;
  //   }
  // };

  // getPrivateKeys = async (addresses: AddressEntry) => {
  //   const { KeyringController } = this.context;

  //   try {
  //     const evm = addresses[EVM_KEY];
  //     const btc = addresses[BTC_KEY];
  //     const evmKey = evm
  //       ? await KeyringController.exportEvmAccount(evm)
  //       : undefined;
  //     const btcKey = btc
  //       ? await KeyringController.exportBtcAccount(btc)
  //       : undefined;
  //     return {
  //       evmKey: evmKey,
  //       btcKey: btcKey,
  //     };
  //   } catch (e) {
  //     return new Promise((_, reject) => {
  //       reject(new Error(`${e}`));
  //     });
  //   }
  // };

  // getDrivedAccount = async (keyringId: string) => {
  //   const { KeyringController } = this.context;

  //   return KeyringController.getDerivedAccounts(keyringId);
  // };

  verifyPassword = async (password: string) => {
    const { KeyringController } = this.context;
    try {
      return KeyringController.verifyPassword(password);
    } catch (e) {
      return new Promise((_, reject) => {
        reject(new Error(`${e}`));
      });
    }
  };

  getAllKeyrings = () => {
    const { KeyringController } = this.context;
    return KeyringController.getAllKeyrings();
  };
}

let instance: Engine;

export default {
  get context() {
    return instance && instance.context;
  },
  get controllerMessenger() {
    return instance && instance.controllerMessenger;
  },
  get state() {
    if (!instance.datamodel) {
      return {};
    }
    const { KeyringController, EncryptionController } =
      instance.datamodel.state;

    // const modifiedCurrencyRateControllerState = {
    //   ...CurrencyRateController,
    //   conversionRate:
    //     CurrencyRateController.conversionRate === null
    //       ? 0
    //       : CurrencyRateController.conversionRate,
    // };

    return {
      KeyringController,

      EncryptionController,
    };
  },
  get datamodel() {
    return instance.datamodel;
  },
  get methods() {
    return {
      importAccountWithSeed: instance.importAccountWithSeed,
      createNewVaultAndRestore: instance.createNewVaultAndRestore,
      importAccountWithStrategy: instance.importAccountWithStrategy,
      createNewVaultAndRestoreByPrivateKey:
        instance.createNewVaultAndRestoreByPrivateKey,
      createNewVaultAndKeychain: instance.createNewVaultAndKeychain,
      removeWallet: instance.removeWallet,
      verifyPassword: instance.verifyPassword,
      getAllKeyrings: instance.getAllKeyrings,
    };
  },
  /**
   * 로컬 스토리지 저장이 필요 없는 컨트롤러, 전역에서 사용하기 위해 엔진에 생성
   * cc. getBiportCustomTokenListController, getAppStateController
   */
  getTotalFiatAccountBalance() {
    return instance.getTotalFiatAccountBalance();
  },
  hasFunds() {
    return instance.hasFunds();
  },
  resetState() {
    return instance.resetState();
  },
  // sync(data: any) {
  //   return instance.sync(data);
  // },
  refreshTransactionHistory(forceCheck = false) {
    return instance.refreshTransactionHistory(forceCheck);
  },
  init(state: {} | undefined) {
    instance = new Engine(state);
    Object.freeze(instance);
    return instance;
  },
};
