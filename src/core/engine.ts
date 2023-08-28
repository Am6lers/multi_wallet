import { EncryptionControlState } from './../scripts/controllers/encryption/index';
import {
  ComposableController,
  ControllerMessenger,
  PhishingController,
  PhishingState,
  PersonalMessageManager,
  MessageManager,
  TypedMessageManager,
  ApprovalController,
  Listener,
  BaseController,
  ApprovalControllerState,
} from '@metamask/controllers';
import CipherKeyringController, {
  Addresses,
  BTC_KEY,
  EVM_KEY,
  PrivateKeys,
  HdPathOpts,
} from '../scripts/controllers/keyring';
import { KeyringState } from '../scripts/controllers/keyring/cipherKeyringController';
import CipherNetworkController, {
  NetworkControllerState,
} from '../scripts/controllers/network';
import CipherPreferencesController, {
  PreferencesState,
  AddressEntry,
} from '../scripts/controllers/preferences';
import { TransactionState } from '../scripts/controllers/transaction/CipherMobileTransactionController';
import * as bip39 from 'bip39';
import Encryptor from './Encryptor';
import { MAINNET, NETWORKS } from '@constants/network';
import { addressesObjectToString } from '../utils/address';
import { Mutex } from 'await-semaphore';
import { MessageManagerState } from '@metamask/controllers/dist/message-manager/AbstractMessageManager';
import AppStateController from '@scripts/controllers/app-state';
import DeepLinkController from '@scripts/controllers/deepLink';

const encryptor = new Encryptor();
let currentChainId: any;

export interface EngineContext {
  KeyringController: CipherKeyringController;
  NetworkController: CipherNetworkController;
  PreferencesController: CipherPreferencesController;
  PhishingController: PhishingController;
  // TransactionController: CipherMobileTransactionController;
  MessageManager: MessageManager;
  PersonalMessageManager: PersonalMessageManager;
  TypedMessageManager: TypedMessageManager;
  ApprovalController: ApprovalController;
  // EncryptionController: EncryptionController;
  DeepLinkController: DeepLinkController;
}

export type EngineInitState = {
  KeyringController?: KeyringState | undefined;
  NetworkController?: NetworkControllerState | undefined;
  PreferencesController?: PreferencesState | undefined;
  PhishingController?: PhishingState | undefined;
  // TransactionController?: TransactionState | undefined;
  MessageManager?: MessageManagerState<any> | undefined;
  PersonalMessageManager?: undefined;
  TypedMessageManager?: undefined;
  ApprovalController?: ApprovalControllerState | undefined;
  // GasFeeController?: GasFeeController | undefined;
  // EncryptionController?: EncryptionControlState | undefined;
  DeepLinkController?: DeepLinkController | undefined;
};

export type EngineContextNames = keyof EngineContext;

export type InitStateNames = keyof EngineInitState;

export type Controllers = [
  CipherKeyringController,
  CipherNetworkController,
  CipherPreferencesController,
  PhishingController,
  // CipherMobileTransactionController,
  MessageManager,
  PersonalMessageManager,
  TypedMessageManager,
  ApprovalController,
  // EncryptionController,
  DeepLinkController,
];

export const controllerNames: EngineContextNames[] = [
  'KeyringController',
  'NetworkController',
  'PreferencesController',
  'PhishingController',
  // 'TransactionController',
  'MessageManager',
  'PersonalMessageManager',
  'TypedMessageManager',
  'ApprovalController',
  // 'EncryptionController',
  'DeepLinkController',
];

interface SyncParams {
  accounts: KeyringState;
  preferences: PreferencesState;
  network: NetworkControllerState;
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
    KeyringController: {} as CipherKeyringController,
    NetworkController: {} as CipherNetworkController,
    PreferencesController: {} as CipherPreferencesController,
    PhishingController: {} as PhishingController,
    // TransactionController: {} as CipherMobileTransactionController,
    MessageManager: {} as MessageManager,
    PersonalMessageManager: {} as PersonalMessageManager,
    TypedMessageManager: {} as TypedMessageManager,
    ApprovalController: {} as ApprovalController,
    // EncryptionController: {} as EncryptionController,
    DeepLinkController: {} as DeepLinkController,
  };

  /**
   * Object containing the info for the latest incoming tx block
   * for each address and network
   */
  lastIncomingTxBlockInfo: any;
  controllerMessenger: ControllerMessenger<any, any> | undefined;
  appStateController: AppStateController | undefined;
  createVaultMutex = new Mutex();
  /**
   * Creates a CoreController instance
   */
  constructor(initialState: EngineInitState = {}) {
    if (!Engine.instance) {
      const keyringController = new CipherKeyringController({
        initState: initialState?.KeyringController ?? undefined,
        encryptor: encryptor,
        isTest: false,
      });
      const networkController = new CipherNetworkController({
        initState: {
          ...(initialState.NetworkController ?? undefined),
          isMobile: true,
        },
        defaultRpcTargets: NETWORKS,
      });

      const preferencesController = new CipherPreferencesController({
        initState: initialState?.PreferencesController ?? undefined,
        network: networkController,
      });
      this.controllerMessenger = new ControllerMessenger();

      // const transactionController = new CipherMobileTransactionController({
      //   getNetworkState: () => networkController?.getProviderConfig(),
      //   onNetworkStateChange: (listener: Listener<NetworkControllerState>) =>
      //     networkController.subscribe(listener),
      //   getProvider: () =>
      //     networkController?.getProviderAndBlockTracker().provider,
      //   getNetworkByChainId:
      //     networkController.getNetworkByChainId.bind(networkController),
      //   preferencesController,
      // });

      // const gasFeeController = new GasFeeController({
      //   initState: initialState.GasFeeController,
      //   networkController: networkController,
      //   pricesController: pricesController,
      //   interval: 15000,
      // });

      // const encryptionController = new EncryptionController({
      //   initState: initialState.EncryptionController,
      //   keyringController: keyringController,
      //   preferencesController: preferencesController,
      //   encryptor: encryptor,
      // });

      const deepLinkController = new DeepLinkController({
        initState: {},
        keyringController: keyringController,
      });

      this.appStateController = new AppStateController();
      this.appStateController.init();

      const controllers: Controllers = [
        keyringController,
        networkController,
        preferencesController,
        new PhishingController(),
        // transactionController,
        new MessageManager(),
        new PersonalMessageManager(),
        new TypedMessageManager(),
        new ApprovalController({
          messenger: this.controllerMessenger.getRestricted({
            name: 'ApprovalController',
          }),
          showApprovalRequest: () => undefined,
        }),
        // encryptionController,
        deepLinkController,
      ];

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
      this.datamodel = new ComposableController(
        controllers,
        this.controllerMessenger as any,
      );

      this.context = {
        KeyringController: controllers[0],
        NetworkController: controllers[1],
        PreferencesController: controllers[2],
        PhishingController: controllers[3],
        // TransactionController: controllers[4],
        MessageManager: controllers[4],
        PersonalMessageManager: controllers[5],
        TypedMessageManager: controllers[6],
        ApprovalController: controllers[7],
        // EncryptionController: controllers[8],
        DeepLinkController: controllers[8],
      };

      const {
        KeyringController: keyring,
        NetworkController: network,
        // TransactionController: transaction,
        PreferencesController: preferences,
      } = this.context;

      // const syncTokens = async () => {
      //   const {
      //     PreferencesController,
      //     PricesController: currencyPriceController,
      //   } = this.context;
      //   if (!PreferencesController || !this.biportCustomTokenListController) {
      //     return;
      //   }
      //   const tokens = PreferencesController.getTokensForBalanceTracking();

      //   this.biportCustomTokenListController.refreshIsEnabledInfoForCachedTokens(
      //     {
      //       accountTokens: tokens,
      //     },
      //   );

      //   currencyPriceController.start();
      // };

      // transaction.configure({ sign: keyring.signTransaction.bind(keyring) });
      // network.subscribe((state: NetworkControllerState) => {
      //   //{network: string; provider: {chainId: any}}
      //   if (
      //     state.network !== 'loading' &&
      //     state.provider &&
      //     state.provider.chainId !== currentChainId
      //   ) {
      //     // We should add a state or event emitter saying the provider changed
      //     setTimeout(() => {
      //       if (!state.provider) {
      //         return;
      //       }
      //       // this.configureControllersOnNetworkChange();
      //       currentChainId = state.provider.chainId;
      //     }, 500);
      //   }
      // });
      // preferences.hub.on(PREFERENCES_EVENTS.ACCOUNT_CHANGED, () => {
      //   setTimeout(syncTokens.bind(this), 100);
      // });
      // preferences.hub.on(PREFERENCES_EVENTS.CHANGE_USE_TESTNETWORK, () => {
      //   setTimeout(syncTokens.bind(this), 100);
      // });
      // this.context.KeyringController.hub.on('unlock', () => {
      //   setTimeout(syncTokens.bind(this), 500);

      //   setTimeout(async () => {
      //     await preferences.getAccountNfts();
      //   }, 500);
      //   // logEventLogin();
      // });
      // keyring.hub.on('newAccount', () => {
      //   const { MultiChainBalanceTracker: balanceTracker } = this.context;

      //   if (!balanceTracker) {
      //     return;
      //   }
      // });
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

  // configureControllersOnNetworkChange() {
  //   try {
  //     const { NetworkController, TransactionController } = this.context;

  //     const provider: Web3ProviderEngine | null =
  //       NetworkController.getProviderAndBlockTracker().provider;
  //     if (!provider) {
  //       throw new Error('Provider is null.');
  //     }
  //     provider.sendAsync = provider.sendAsync.bind(provider);
  //     TransactionController.configure({ provider });
  //     TransactionController.hub.emit('networkChange');
  //   } catch (e) {
  //     // Logger.error(e, 'Engine - configureControllersOnNetworkChange');
  //     return;
  //   }
  // }

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

  importAccountWithSeed = async (
    mnemonic: string,
    walletName: string,
    hdPath?: { [key: string]: HdPathOpts },
    isNewWallet?: boolean,
  ) => {
    try {
      const { KeyringController, PreferencesController } = this.context;

      const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
      const addresses = await KeyringController.importAccountWithSeed(
        mnemonic,
        hdPath,
        seed,
      );
      const allAccountsAfterAdded =
        await KeyringController.getSerializedAccounts();
      const addedAddress =
        allAccountsAfterAdded[allAccountsAfterAdded.length - 1];
      const accountKey = addressesObjectToString(addresses);
      await PreferencesController.setAddresses(allAccountsAfterAdded);
      await PreferencesController.setAccountLabel(addedAddress, walletName);
      // await this.setNativeTokensWithNewWallet([accountKey]);
      await PreferencesController.setSelectedAddress(addedAddress);
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

  changeSimpleKeyToMultiWallet = async ({
    mnemonic,
    addresses,
    walletName,
    hdPath,
  }: {
    mnemonic: string;
    addresses: Addresses;
    walletName: string;
    hdPath?: { [key: string]: HdPathOpts };
  }) => {
    const { KeyringController, PreferencesController } = this.context;
    const keyring = await KeyringController.replaceSimpleKeyAccountToHDWallet({
      mnemonic,
      privateKeys: addresses,
      hdPath,
    });
    const oldKey = addressesObjectToString(addresses);
    const newAccounts = keyring.getAccounts();
    const newKey = addressesObjectToString(newAccounts);
    await PreferencesController.setAccountLabel(newKey, walletName);
    return keyring.id;
  };

  createNewVaultAndRestore = async (
    password: string,
    seed: string,
    walletName: string,
    isNewWallet: boolean,
    hdPath?: { [key: string]: HdPathOpts },
  ) => {
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      const { KeyringController, PreferencesController } = this.context;

      let accountKeys;
      // clear known identities
      PreferencesController.setAddresses([]);
      // create new vault
      const vault = await KeyringController.createNewVaultAndRestore(
        password,
        seed,
        hdPath,
      );
      accountKeys = await KeyringController.getSerializedAccounts();

      const primaryKeyring =
        KeyringController.getKeyringsByType('HD Key Tree')[0];
      if (!primaryKeyring) {
        throw new Error('MetamaskController - No HD Key Tree found');
      }
      // set new identities
      PreferencesController.setAddresses(accountKeys);
      const selectAddressKey = this.selectFirstIdentity();
      await PreferencesController.setAccountLabel(selectAddressKey, walletName);
      await PreferencesController.setSelectedAddress(selectAddressKey);
      return vault;
    } finally {
      releaseLock();
    }
  };

  importAccountWithStrategy = async (
    privateKeys: PrivateKeys,
    walletName: string,
    masterId?: string,
    numberOfChildAccounts?: number,
    hdPath?: { [key: string]: HdPathOpts },
  ) => {
    const evmPrivateKey = privateKeys.evm || null;
    const btcPrivateKey = privateKeys.btc || null;
    if (!evmPrivateKey && !btcPrivateKey) {
      throw new Error('Cannot import an empty key.');
    }
    const { KeyringController, PreferencesController } = this.context;

    const keyring = await KeyringController.addNewKeyring({
      type: 'Simple Key Pair',
      privateKeys: {
        evm: evmPrivateKey,
        btc: btcPrivateKey,
      },
      masterId,
      isTest: false,
      numberOfDeriven: numberOfChildAccounts,
      hdPath,
    });
    const accountKey = keyring.getSerializedAccounts();
    const allAccounts = await KeyringController.getSerializedAccounts();
    PreferencesController.setAddresses(allAccounts);
    await PreferencesController.setAccountLabel(accountKey, walletName);
    await PreferencesController.setSelectedAddress(accountKey);
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
      const { KeyringController, PreferencesController } = this.context;

      let accountsKeys;
      PreferencesController.setAddresses([]);

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
      PreferencesController.setAddresses(accountsKeys);
      const selectAddressKey = this.selectFirstIdentity();
      await PreferencesController.setAccountLabel(selectAddressKey, walletName);
      await PreferencesController.setSelectedAddress(selectAddressKey);
      return vault;
    } finally {
      releaseLock();
    }
  };

  createNewVaultAndKeychain = async (password: string) => {
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      const { KeyringController, PreferencesController } = this.context;

      let vault;
      const accounts = await KeyringController.getAccounts();
      if (accounts[EVM_KEY].length > 0 || accounts[BTC_KEY].length > 0) {
        vault = await KeyringController.fullUpdate();
      } else {
        vault = await KeyringController.createNewVaultAndKeychain(password);
        const keys = await KeyringController.getSerializedAccounts();
        PreferencesController.setAddresses(keys);
        const selectAddressKey = this.selectFirstIdentity();
        await PreferencesController.setSelectedAddress(selectAddressKey);
      }
      return vault;
    } finally {
      releaseLock();
    }
  };

  selectFirstIdentity = () => {
    const { PreferencesController } = this.context;

    const { identities } = PreferencesController.store.getState();
    const addressKey = Object.keys(identities)[0];
    PreferencesController.setSelectedAddress(addressKey);
    return addressKey;
  };

  removeWallet = async (privateKeys: PrivateKeys) => {
    const { KeyringController, PreferencesController } = this.context;

    const evm = privateKeys[EVM_KEY] || '';
    const btc = privateKeys[BTC_KEY] || '';
    const addresses = `${evm}/${btc}`;

    try {
      await PreferencesController.removeAddress(addresses);
      await KeyringController.removeAccount(evm.toLocaleLowerCase());
    } catch (e) {
      return new Promise((_, reject) => {
        reject(new Error(`${e}`));
      });
    }
  };

  addAdditionalAccount = async (masterId: string, walletName: string) => {
    // {addresses: account, status: 'NEW'}
    const { KeyringController, PreferencesController } = this.context;

    const account = await KeyringController.addAdditionalAccount(masterId);
    if (account.status === 'DUPLICATE') {
      return Promise.resolve(account);
    } else {
      const accountKey = addressesObjectToString(account.addresses);
      const allAccounts = await KeyringController.getSerializedAccounts();
      await PreferencesController.setAddresses(allAccounts);
      await PreferencesController.setAccountLabel(accountKey, walletName);
      await PreferencesController.setSelectedAddress(accountKey);
      return account.addresses;
    }
  };

  getPrivateKeys = async (addresses: AddressEntry) => {
    const { KeyringController } = this.context;

    try {
      const evm = addresses[EVM_KEY];
      const btc = addresses[BTC_KEY];
      const evmKey = evm
        ? await KeyringController.exportEvmAccount(evm)
        : undefined;
      const btcKey = btc
        ? await KeyringController.exportBtcAccount(btc)
        : undefined;
      return {
        evmKey: evmKey,
        btcKey: btcKey,
      };
    } catch (e) {
      return new Promise((_, reject) => {
        reject(new Error(`${e}`));
      });
    }
  };

  getDrivedAccount = async (keyringId: string) => {
    const { KeyringController } = this.context;

    return KeyringController.getDerivedAccounts(keyringId);
  };

  signMessage = async (msgParams: any) => {
    const { KeyringController, MessageManager: msgManager } = this.context;

    const msgId = msgParams.id;

    msgParams.metamaskId = msgParams.id;

    return msgManager
      .approveMessage(msgParams)
      .then((cleanMsgParams: any) => {
        return KeyringController.signMessage(cleanMsgParams);
      })
      .then(rawSig => {
        msgManager.setMessageStatusSigned(msgId, rawSig);
        return rawSig;
      });
  };

  signPersonalMessage = (msgParams: any) => {
    const { KeyringController, PersonalMessageManager: personalMsgManager } =
      this.context;

    const msgId = msgParams.id;
    msgParams.metamaskId = msgParams.id;

    return personalMsgManager
      .approveMessage(msgParams)
      .then((cleanMsgParams: any) => {
        return KeyringController.signPersonalMessage(cleanMsgParams);
      })
      .then(rawSig => {
        personalMsgManager.setMessageStatusSigned(msgId, rawSig);
        return rawSig;
      });
  };

  signTypedMessage = async (msgParams: any) => {
    const { KeyringController, TypedMessageManager: typedMsgManager } =
      this.context;

    const msgId = msgParams.id;
    const { version } = msgParams;
    msgParams.metamaskId = msgParams.id;

    try {
      const cleanMsgParams = await typedMsgManager.approveMessage(msgParams);

      if (version !== 'V1') {
        if (typeof cleanMsgParams.data === 'string') {
          cleanMsgParams.data = JSON.parse(cleanMsgParams.data);
        }
      }

      const signature = await KeyringController.signTypedMessage(
        //@ts-ignore
        cleanMsgParams,
        { version },
      );
      typedMsgManager.setMessageStatusSigned(msgId, signature);
      return 'getState()';
    } catch (error) {
      typedMsgManager.rejectMessage(msgId);
      throw error;
    }
  };

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

  getNetworkByChainId = (chainId: string) => {
    const { NetworkController } = this.context;
    const network = NetworkController.getNetworkByChainId(chainId);
    try {
      if (!network) {
        throw new Error('getNetworkByChainId - undefined network');
      }
      return network;
    } catch {
      return NETWORKS[MAINNET];
    }
  };

  getDefaultNetworks = (useNetwork?: 'mainnet' | 'testnet') => {
    return this.context.NetworkController.getDefaultNetworks(useNetwork);
  };

  // getNetworks = (useNetwork?: 'mainnet' | 'testnet') => {
  //   return this.context.NetworkController.getNetworks(useNetwork);
  // };

  getWeb3Provider = (chainId: string) => {
    return this.context.NetworkController.getWeb3Provider(chainId);
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
    const {
      KeyringController,
      NetworkController,
      PreferencesController,
      PhishingController,
      // TransactionController,
      MessageManager,
      PersonalMessageManager,
      TypedMessageManager,
      ApprovalController,
      // GasFeeController,
      // EncryptionController,
      DeepLinkController,
    } = instance.datamodel.state;

    // const modifiedCurrencyRateControllerState = {
    //   ...CurrencyRateController,
    //   conversionRate:
    //     CurrencyRateController.conversionRate === null
    //       ? 0
    //       : CurrencyRateController.conversionRate,
    // };

    return {
      KeyringController,
      NetworkController,
      PreferencesController,
      PhishingController,
      // TransactionController,
      MessageManager,
      PersonalMessageManager,
      TypedMessageManager,
      ApprovalController,
      // GasFeeController,
      // EncryptionController,
      DeepLinkController,
    };
  },
  get datamodel() {
    return instance.datamodel;
  },
  get methods() {
    return {
      importAccountWithSeed: instance.importAccountWithSeed,
      changeSimpleKeyToMultiWallet: instance.changeSimpleKeyToMultiWallet,
      createNewVaultAndRestore: instance.createNewVaultAndRestore,
      importAccountWithStrategy: instance.importAccountWithStrategy,
      createNewVaultAndRestoreByPrivateKey:
        instance.createNewVaultAndRestoreByPrivateKey,
      createNewVaultAndKeychain: instance.createNewVaultAndKeychain,
      addAdditionalAccount: instance.addAdditionalAccount,
      removeWallet: instance.removeWallet,
      getPrivateKeys: instance.getPrivateKeys,
      getDrivedAccount: instance.getDrivedAccount,
      signMessage: instance.signMessage,
      signPersonalMessage: instance.signPersonalMessage,
      signTypedMessage: instance.signTypedMessage,
      verifyPassword: instance.verifyPassword,
      getAllKeyrings: instance.getAllKeyrings,
      getNetworkByChainId: instance.getNetworkByChainId,
      getDefaultNetworks: instance.getDefaultNetworks,
      getWeb3Provider: instance.getWeb3Provider,
    };
  },
  /**
   * 로컬 스토리지 저장이 필요 없는 컨트롤러, 전역에서 사용하기 위해 엔진에 생성
   * cc.  getAppStateController
   */
  getAppStateController() {
    try {
      if (!(instance.appStateController instanceof AppStateController)) {
        throw new Error();
      }
      return instance.appStateController;
    } catch {
      instance.appStateController = new AppStateController();
      return instance.appStateController;
    }
  },
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
    console.log('engine state', state);
    instance = new Engine(state);
    Object.freeze(instance);
    return instance;
  },
};
