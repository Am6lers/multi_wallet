import * as bip39 from 'bip39';
// @ts-ignore
import encryptor from 'browser-passworder';
import { toBuffer, isValidPrivate, unpadHexString } from 'ethereumjs-util';
import { networks, ECPair } from 'bitcoinjs-lib';
import EventEmitter from 'events';
import CipherKeyring, {
  TYPE_SIMPLE_KEY_PAIR,
  TYPE_HD_KEY_TREE,
  EVM_KEY,
  BTC_KEY,
  WALLETTYPE_MULTY,
} from './cipherKeyring';
import { normalize, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { ObservableStore } from '@metamask/obs-store';
import {
  KeyringOpts,
  PrivateKeys,
  DisplayKeyring,
  SignMessageParams,
  PersonalMessageParams,
  DecryptMessageParams,
  TypedMessageParams,
  AdditionalAccountResult,
  UnlockError,
  HdPathOpts,
} from './types';
import { addHexPrefix, isInvalidAccount } from './utils';
import { BaseController, BaseConfig, BaseState } from '@metamask/controllers';
import objectToHash from 'object-hash';

export interface KeyringParam {
  initState: any;
  encryptor?: any;
  isTest?: boolean;
}

export interface KeyringState extends BaseState {
  vault?: string;
  oldVault?: string;
  keyrings: DisplayKeyring[];
  isUnlocked: boolean;
  keyringTypes: any[];
}

/**
 * cipher 지갑의 계정의 생성 및 추가 그리고 암호화 및 복호화를 관리합니다.
 */

export default class CipherKeyringController extends BaseController<
  BaseConfig,
  KeyringState
> {
  name = 'KeyringController';

  public keyringTypes = [TYPE_SIMPLE_KEY_PAIR, TYPE_HD_KEY_TREE];
  public store: any;
  public memStore: any;
  protected encryptor: any;
  protected keyrings: CipherKeyring[];
  protected password: string | null | undefined = null;
  public isTest = false;

  hub = new EventEmitter();

  constructor(opts: KeyringParam) {
    console.log('initState', opts);
    super(undefined, opts?.initState);
    const initState = opts?.initState ?? {};
    this.store = new ObservableStore(initState);
    this.memStore = new ObservableStore({
      isUnlocked: false,
      keyringTypes: this.keyringTypes,
      keyrings: [],
    });

    this.encryptor = opts.encryptor ?? encryptor;
    this.keyrings = [];
    this.isTest = Boolean(opts?.isTest);
    this.initialize();
    this.fullUpdate();
  }

  public fullUpdate() {
    this.update({ ...this.memStore.getState() });
    return this.memStore.getState();
  }

  public createNewVaultAndKeychain(password: string) {
    return this.persistAllKeyrings(password)
      .then(this.createFirstKeyTree.bind(this))
      .then(this.persistAllKeyrings.bind(this, password))
      .then(this.setUnlocked.bind(this))
      .then(this.fullUpdate.bind(this));
  }

  public isValidateBtcBase58PrivateKey(privateKey: string): boolean {
    let isValid = false;
    const btc = networks.bitcoin;
    const tbtc = networks.testnet;
    try {
      ECPair.fromWIF(privateKey, [btc, tbtc]);
      isValid = true;
    } catch (e) {
      isValid = false;
    }
    return isValid;
  }

  public createNewVaultAndRestore(
    password: string,
    seed: string,
    hdPath?: { [key: string]: HdPathOpts },
  ) {
    if (typeof password !== 'string') {
      return Promise.reject(new Error('Password must be text.'));
    }

    if (!bip39.validateMnemonic(seed)) {
      return Promise.reject(new Error('Seed phrase is invalid.'));
    }

    this.clearKeyrings();

    return this.persistAllKeyrings(password)
      .then(() => {
        return this.addNewKeyring({
          type: TYPE_HD_KEY_TREE,
          mnemonic: seed,
          isTest: this.isTest,
          hdPath,
          superMaster: true,
        });
      })
      .then(firstKeyring => {
        return firstKeyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error('CipherKeyringController - First Account not found.');
        }
        return null;
      })
      .then(this.persistAllKeyrings.bind(this, password))
      .then(this.setUnlocked.bind(this))
      .then(this.fullUpdate.bind(this));
  }

  public createNewVaultAndRestoreByPrivateKeys(
    password: string,
    privateKeys: PrivateKeys,
  ) {
    if (typeof password !== 'string') {
      return Promise.reject(new Error('Password must be text.'));
    }

    let evmPrivateKey: string | null =
      typeof privateKeys[EVM_KEY] === 'string' ? privateKeys[EVM_KEY] : null;
    const btcPrivateKey: string | null =
      typeof privateKeys[BTC_KEY] === 'string' ? privateKeys[BTC_KEY] : null;
    if (evmPrivateKey) {
      const prefixed = addHexPrefix(evmPrivateKey);
      const buffer = toBuffer(prefixed);
      if (!isValidPrivate(buffer)) {
        throw new Error('Cannot import invalid private key: evm.');
      }
      evmPrivateKey = unpadHexString(prefixed);
    }

    if (!evmPrivateKey && !btcPrivateKey) {
      return Promise.reject(new Error('PrivateKeys must be text.'));
    }

    this.clearKeyrings();

    return this.persistAllKeyrings(password)
      .then(() => {
        return this.addNewKeyring({
          type: TYPE_SIMPLE_KEY_PAIR,
          privateKeys: { [EVM_KEY]: evmPrivateKey, [BTC_KEY]: btcPrivateKey },
          masterId: undefined,
          isTest: this.isTest,
          superMaster: true,
        });
      })
      .then(firstKeyring => {
        return firstKeyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error('KeyringController - First Account not found.');
        }
        return null;
      })
      .then(this.persistAllKeyrings.bind(this, password))
      .then(this.setUnlocked.bind(this))
      .then(this.fullUpdate.bind(this));
  }

  public importAccountWithSeed(
    mnemonic: string,
    hdPath?: { [key: string]: HdPathOpts },
    seed?: string,
    // seed?: Buffer
  ) {
    if (!bip39.validateMnemonic(mnemonic)) {
      return Promise.reject(new Error('Seed phrase is invalid.'));
    }
    return this.addNewKeyring({
      type: TYPE_HD_KEY_TREE,
      mnemonic,
      masterId: undefined,
      isTest: this.isTest,
      walletType: WALLETTYPE_MULTY,
      hdPath,
      seed: seed,
      superMaster: false,
    })
      .then(keyring => {
        return keyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error('CipherKeyringController - First Account not found.');
        }
        return account;
      });
  }

  getIsUnlocked() {
    return this.memStore.getState().isUnlocked;
  }

  async setLocked() {
    this.password = null;
    this.update({ isUnlocked: false });
    this.memStore.updateState({ isUnlocked: false });
    this.keyrings = [];
    this._updateMemStoreKeyrings();
    this.hub.emit('lock');
    return this.fullUpdate();
  }

  async submitPassword(password: string) {
    return this.unlockKeyrings(password).then(keyrings => {
      this.keyrings = keyrings;
      this.setUnlocked();
      return this.fullUpdate();
    });
  }

  async verifyPassword(password: string) {
    const encryptedVault = this.store.getState().vault;
    if (!encryptedVault) {
      throw new Error('Cannot unlock without a previous vault.');
    }
    await this.encryptor.decrypt(password, encryptedVault);
  }

  async addNewKeyring(opts: KeyringOpts) {
    const { keyrings } = this.memStore.getState();
    const keyring =
      keyrings.length == 0
        ? new CipherKeyring(Object.assign(opts, { superMaster: true }))
        : new CipherKeyring(opts);
    const newKeyringAccounts = keyring.getAccounts();
    let duplicate = false;
    keyrings.forEach((kr: DisplayKeyring) => {
      const evmDup = Boolean(
        kr.accounts[EVM_KEY] &&
          newKeyringAccounts[EVM_KEY] &&
          kr.accounts[EVM_KEY] === newKeyringAccounts[EVM_KEY],
      );
      const btcDup = Boolean(
        kr.accounts[BTC_KEY] &&
          newKeyringAccounts[BTC_KEY] &&
          kr.accounts[BTC_KEY] === newKeyringAccounts[BTC_KEY],
      );
      if (evmDup || btcDup) {
        duplicate = true;
      }
    });

    if (duplicate) {
      throw new Error('added duplicate account.');
    }
    return Promise.resolve(keyring.getAccounts())
      .then(accounts => {
        return this.checkForDuplicate(opts.type, accounts);
      })
      .then(() => {
        const availableNum = keyring.getAvailableNumber();
        if (keyring.masterId) {
          const masterKeyring = this.keyrings.filter(kr => {
            return kr.id === keyring.masterId;
          })[0];
          const derivenNumber = opts.numberOfDeriven
            ? Number(opts.numberOfDeriven)
            : 0;
          if (!masterKeyring) {
            throw new Error('does not have master keyring');
          }
          masterKeyring.addNumbersOfChildren(derivenNumber);
        }
        keyring.addNumbersOfChildren(availableNum);
        this.keyrings.push(keyring);
        return this.persistAllKeyrings();
      })
      .then(() => this._updateMemStoreKeyrings())
      .then(() => this.fullUpdate())
      .then(() => {
        this.hub.emit('newAccount', keyring.getAccounts());
        return keyring;
      });
  }

  async removeEmptyKeyrings() {
    const validKeyrings: CipherKeyring[] = [];

    await Promise.all(
      this.keyrings.map(keyring => {
        const accounts = keyring.getAccounts();
        if (!isInvalidAccount(accounts)) {
          validKeyrings.push(keyring);
        }
      }),
    );
    this.keyrings = validKeyrings;
  }

  async checkForDuplicate(type: string, accountPrivateKeys: PrivateKeys) {
    return this.getAccounts().then(accounts => {
      switch (type) {
        case TYPE_SIMPLE_KEY_PAIR: {
          const isIncluded =
            Boolean(
              accounts[EVM_KEY].find(
                key =>
                  key === accountPrivateKeys[EVM_KEY] ||
                  key === unpadHexString(accountPrivateKeys[EVM_KEY] ?? ''),
              ),
            ) ||
            Boolean(
              accounts[BTC_KEY].find(
                key => key === accountPrivateKeys[BTC_KEY],
              ),
            );
          return isIncluded
            ? Promise.reject(
                new Error(
                  'The account you are trying to import is a duplicate',
                ),
              )
            : Promise.resolve(accountPrivateKeys);
        }
        default: {
          return Promise.resolve(accountPrivateKeys);
        }
      }
    });
  }

  async addAdditionalAccount(
    masterId: string,
  ): Promise<AdditionalAccountResult> {
    const selectedKeyring = this.keyrings.filter(
      keyring => keyring.id === masterId,
    )[0];
    if (!selectedKeyring) {
      throw new Error('Invalid argument id: Keyring');
    }
    if (selectedKeyring?.type !== TYPE_HD_KEY_TREE) {
      throw new Error(
        `Keyring ${selectedKeyring.type} doesn't support additional account`,
      );
    }
    if (!selectedKeyring?.id) {
      throw new Error('Invalid keyring id: Keyring');
    }
    const nextDerivenNumber = selectedKeyring.getAvailableNumber();
    const nextDeriveKeys = selectedKeyring.getDerivedAccount(nextDerivenNumber);

    const duplicateKeyringIds = this.keyrings
      .filter(keyring => {
        const keyringKeys = keyring.getAccounts();
        return (
          (keyringKeys.evm === nextDeriveKeys.evm_address ||
            keyringKeys.btc === nextDeriveKeys.btc_address) &&
          keyring.type === 'Simple Key Pair'
        );
      })
      .map(keyring => keyring.id);

    if (duplicateKeyringIds.length > 0) {
      let masterNum = nextDerivenNumber;
      for (let i = 0; i < this.keyrings.length; i++) {
        if (duplicateKeyringIds.includes(this.keyrings[i].id)) {
          this.keyrings[i].setMasterId(masterId);
          this.keyrings[i].setNumberOfDeriven(masterNum);
          selectedKeyring.addNumbersOfChildren(masterNum);
          masterNum++;
        }
      }

      await this.persistAllKeyrings();
      this._updateMemStoreKeyrings();

      return Promise.resolve({
        addresses: {
          evm: nextDeriveKeys.evm_address,
          btc: nextDeriveKeys.btc_address,
        },
        status: 'DUPLICATE',
      });
    }

    return this.addNewKeyring({
      type: TYPE_SIMPLE_KEY_PAIR,
      privateKeys: {
        evm: nextDeriveKeys.evm,
        btc: nextDeriveKeys.btc,
      },
      masterId: selectedKeyring.id,
      isTest: this.isTest,
      numberOfDeriven: nextDerivenNumber,
      superMaster: false,
    })
      .then(keyring => {
        return keyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error('CipherKeyringController - First Account not found.');
        }
        return { addresses: account, status: 'NEW' };
      });
  }

  getDerivedAccounts(keyringId: string, numberOfChild = 10): Promise<any[]> {
    const selectedKeyring = this.keyrings.filter(kr => kr.id === keyringId)[0];
    if (!selectedKeyring) {
      throw new Error('CipherKeyringController - keyringId is invalid');
    }
    return Promise.resolve(
      Array(numberOfChild)
        .fill(0)
        .map((st, i) => st + i)
        .map(idx => selectedKeyring.getDerivedAccount(idx)),
    );
  }

  public getAllKeyrings() {
    console.log(this.keyrings);
    return this.memStore.getState().keyrings;
  }

  async exportEvmAccount(address: string): Promise<string | undefined | null> {
    try {
      return this.getKeyringForAccount(address).then(keyring => {
        return keyring.exportEvmAccount(normalize(address));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async exportBtcAccount(address: string): Promise<string | undefined | null> {
    try {
      return this.getKeyringForAccount(address).then(keyring => {
        return keyring.exportBtcAccount(address);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  removeAccount(address: string) {
    let masterId: string | null = null;
    let numberOfDeriven = 0;
    return this.getKeyringForAccount(address)
      .then(keyring => {
        // Not all the keyrings support this, so we have to check
        if (typeof keyring.removeAccount === 'function') {
          masterId = keyring.masterId;
          numberOfDeriven = keyring.numberOfDeriven;
          keyring.removeAccount(address);
          if (masterId && numberOfDeriven > 0) {
            const masterKeyring = this.keyrings.filter(kr => {
              return kr.id === keyring.masterId;
            })[0];

            if (typeof masterKeyring.subNumberOfChildren === 'function') {
              masterKeyring.subNumberOfChildren(numberOfDeriven);
            }
          }
          return keyring.getAccounts();
        }
        return Promise.reject(
          new Error(
            `Keyring ${keyring.type} doesn't support account removal operations`,
          ),
        );
      })
      .then(accounts => {
        // Check if this was the last/only account
        if (isInvalidAccount(accounts)) {
          return this.removeEmptyKeyrings();
        }
        return undefined;
      })
      .then(this.persistAllKeyrings.bind(this, undefined))
      .then(this._updateMemStoreKeyrings.bind(this))
      .then(this.fullUpdate.bind(this))
      .catch(e => {
        return Promise.reject(e);
      });
  }

  async signTransaction(ethTx: any, _fromAddress: string, opts = {}) {
    const fromAddress = normalize(_fromAddress);
    return this.getKeyringForAccount(fromAddress).then(keyring => {
      return keyring.signTransaction(fromAddress, ethTx, opts);
    });
  }

  async signMessage(msgParams: SignMessageParams, opts = {}) {
    const address = normalize(msgParams.from);
    return this.getKeyringForAccount(address).then(keyring => {
      return keyring.signMessage(address, msgParams.data, opts);
    });
  }

  async signPersonalMessage(msgParams: PersonalMessageParams, opts = {}) {
    const address = normalize(msgParams.from);
    return this.getKeyringForAccount(address).then(keyring => {
      return keyring.signPersonalMessage(address, msgParams.data, opts);
    });
  }

  async getEncryptionPublicKey(_address: string, opts = {}) {
    const address = normalize(_address);
    return this.getKeyringForAccount(address).then(keyring => {
      return keyring.getEncryptionPublicKey(address, opts);
    });
  }

  async decryptMessage(msgParams: DecryptMessageParams, opts = {}) {
    const address = normalize(msgParams.from);
    return this.getKeyringForAccount(address).then(keyring => {
      return keyring.decryptMessage(address, msgParams.data, opts);
    });
  }

  async signTypedMessage(
    msgParams: TypedMessageParams,
    opts = { version: SignTypedDataVersion.V1 },
  ) {
    const address = normalize(msgParams.from);
    return this.getKeyringForAccount(address).then(keyring => {
      return keyring.signTypedData(address, msgParams.data, opts);
    });
  }

  async getAppKeyAddress(_address: string, origin: string) {
    const address = normalize(_address);
    const keyring = await this.getKeyringForAccount(address);
    return keyring.getAppKeyAddress(address, origin);
  }

  async exportAppKeyForAddress(_address: string, origin: string) {
    const address = normalize(_address);
    const keyring = await this.getKeyringForAccount(address);
    if (!('exportEvmAccount' in keyring)) {
      throw new Error(
        `The keyring for address ${_address} does not support exporting.`,
      );
    }
    return keyring.exportEvmAccount(address, { withAppKeyOrigin: origin });
  }

  async createFirstKeyTree() {
    this.clearKeyrings();
    return this.addNewKeyring({
      type: TYPE_HD_KEY_TREE,
      isTest: this.isTest,
      superMaster: true,
    })
      .then(keyring => {
        return keyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error(
            'CipherKeyringController - No account found on keychain.',
          );
        }
        return null;
      });
  }

  persistAllKeyrings(password = this.password) {
    if (typeof password !== 'string') {
      return Promise.reject(
        new Error('CipherKeyringController - password is not a string'),
      );
    }

    this.password = password;
    return Promise.all(
      this.keyrings.map(keyring => {
        return Promise.resolve(keyring.serialize()).then(serializedKeyring => {
          // Label the output values on each serialized Keyring:
          return serializedKeyring;
        });
      }),
    )
      .then(serializedKeyrings => {
        return this.encryptor.encrypt(this.password, serializedKeyrings);
      })
      .then(encryptedString => {
        this.store.updateState({ vault: encryptedString });
        this.update({ vault: encryptedString });
        return true;
      });
  }

  storeOldVault(vault: string) {
    this.store.updateState({ oldVault: vault });
    this.update({ oldVault: vault });
  }

  async unlockKeyrings(password: string): Promise<CipherKeyring[]> {
    const encryptedVault = this.store.getState().vault;
    if (!encryptedVault) {
      throw new Error(UnlockError.WITHOUT_VAULT);
    }

    await this.clearKeyrings();
    const vault = await this.encryptor.decrypt(password, encryptedVault);
    let isNewKeyring = true;
    for (const storedKeyring of vault) {
      if (
        !Reflect.has(storedKeyring, 'id') ||
        typeof storedKeyring.id !== 'string'
      ) {
        isNewKeyring = false;
      }
    }

    if (!isNewKeyring) {
      throw new Error(UnlockError.NOT_MIGRATED);
    }

    this.password = password;
    await Promise.all(vault.map(this._restoreKeyring.bind(this)));
    this._updateMemStoreKeyrings();
    return this.keyrings;
  }

  async restoreKeyring(serialized: any) {
    const keyring = await this._restoreKeyring(serialized);
    this._updateMemStoreKeyrings();
    return keyring;
  }

  async _restoreKeyring(serialized: any) {
    const options = Object.assign({}, serialized, { isTest: this.isTest });
    // console.log("Restore keyring options - ", options)
    const keyring = new CipherKeyring(options);
    this.keyrings.push(keyring);
    return keyring;
  }

  async getAccounts() {
    const keyrings = this.keyrings || [];
    const accountRes: { [key: string]: any[] } = {
      [EVM_KEY]: [],
      [BTC_KEY]: [],
    };
    return await Promise.all(keyrings.map(kr => kr.getAccounts())).then(
      keyringArrays => {
        return keyringArrays.reduce((res, arr) => {
          if (typeof arr[EVM_KEY] === 'string') {
            res[EVM_KEY].push(arr[EVM_KEY]);
          }
          if (typeof arr[BTC_KEY] === 'string') {
            res[BTC_KEY].push(arr[BTC_KEY]);
          }
          return res;
        }, accountRes);
      },
    );
  }

  async getSerializedAccounts() {
    const keyrings = this.keyrings || [];
    return await Promise.all(
      keyrings.map(kr => kr.getSerializedAccounts()),
    ).then(keyringArrays => keyringArrays);
  }

  async getEvmAccounts() {
    const keyrings = this.keyrings || [];
    const accountRes: any[] = [];
    return await Promise.all(keyrings.map(kr => kr.getAccounts())).then(
      keyringArrays => {
        return keyringArrays.reduce((res, arr) => {
          if (arr[EVM_KEY] && typeof arr[EVM_KEY] === 'string') {
            res.push(arr[EVM_KEY]);
          }
          return res;
        }, accountRes);
      },
    );
  }

  getKeyringsByType(type: string) {
    return this.keyrings.filter(keyring => keyring.type === type);
  }

  async getKeyringForAccount(address: string): Promise<CipherKeyring> {
    const hexed = normalize(address);

    return Promise.all(
      this.keyrings.map(keyring => {
        return Promise.all([keyring, keyring.getAccounts()]);
      }),
    ).then(candidates => {
      const winners = candidates.filter(candidate => {
        const evmAddress = candidate[1]?.[EVM_KEY];
        const btcAddress = candidate[1]?.[BTC_KEY];
        return evmAddress === hexed || btcAddress === address;
      });
      if (winners && winners.length > 0) {
        return winners[0][0];
      }

      // Adding more info to the error
      let errorInfo = '';
      if (!address) {
        errorInfo = 'The address passed in is invalid/empty';
      } else if (!candidates || !candidates.length) {
        errorInfo = 'There are no keyrings';
      } else if (!winners || !winners.length) {
        errorInfo = 'There are keyrings, but none match the address';
      }
      throw new Error(
        `No keyring found for the requested account. Error info: ${errorInfo}`,
      );
    });
  }

  async checkIsAccountAddress(address: string): Promise<boolean> {
    const hexed = normalize(address);

    return Promise.all(
      this.keyrings.map(keyring => {
        return Promise.all([keyring, keyring.getAccounts()]);
      }),
    ).then(candidates => {
      const winners = candidates.filter(candidate => {
        const evmAddress = candidate[1]?.[EVM_KEY];
        const btcAddress = candidate[1]?.[BTC_KEY];
        return evmAddress === hexed || btcAddress === address;
      });
      if (!winners || !winners.length || !winners[0] || !winners[0][0]) {
        return false;
      }
      const keyring = winners[0][0];
      return keyring ? true : false;
    });
  }

  displayForKeyring(keyring: CipherKeyring): DisplayKeyring {
    const keys = keyring.getAccounts();
    return {
      id: keyring.id,
      masterId: keyring.masterId,
      type: keyring.type,
      superMaster: keyring?.superMaster,
      accounts: {
        [EVM_KEY]: keys[EVM_KEY],
        [BTC_KEY]: keys[BTC_KEY],
      },
      walletType: keyring.walletType,
      numberOfDeriven: keyring.numberOfDeriven,
      numbersOfChildren:
        keyring.numbersOfChildren.size > 0
          ? Array.from(keyring.numbersOfChildren)
          : [],
    };
  }

  async clearKeyrings() {
    // clear keyrings from memory
    this.keyrings = [];
    this.update({
      keyrings: [],
    });
    this.memStore.updateState({
      keyrings: [],
    });
  }

  _updateMemStoreKeyrings() {
    const keyrings = this.keyrings.map(this.displayForKeyring);
    this.update({ keyrings });
    return this.memStore.updateState({ keyrings });
  }

  setUnlocked() {
    this.update({
      isUnlocked: true,
    });
    this.memStore.updateState({ isUnlocked: true });
    this.hub.emit('unlock');
  }

  getPassword() {
    return this.password;
  }

  getKeyringsByAddress(address: string, isKeyringForDisplay = true) {
    const hexed = normalize(address);
    if (!isKeyringForDisplay) {
      return this.keyrings.filter((keyring: any) => {
        const accountKey = keyring.getSerializedAccounts();
        return (
          accountKey.indexOf(hexed) > -1 || accountKey.indexOf(address) > -1
        );
      });
    }
    const { keyrings } = this.memStore.getState();
    return keyrings.filter(
      (keyring: any) =>
        keyring.accounts[EVM_KEY] === hexed ||
        keyring.accounts[BTC_KEY] === address,
    );
  }

  async getSuperMasterPrivateKey() {
    return this.getSuperMasterKeyring().accounts.evm;
  }

  getSuperMasterKeyring() {
    const { keyrings } = this.memStore.getState();
    return keyrings.filter((keyring: any) => keyring.superMaster == true)[0];
  }

  async displayForAllKeyrings() {
    const allKeyrings = this.keyrings
      .map(this.displayForKeyring)
      .filter(kr => kr !== null && kr !== undefined);

    const childrenId = this.keyrings.reduce((acc: any, kr) => {
      if (kr?.masterId) {
        if (!(kr.masterId in acc)) {
          acc[kr.masterId] = [];
        }
        acc[kr.masterId].push(kr.id);
      }
      return acc;
    }, {});
    return allKeyrings.map(kr => {
      if (!kr.id) {
        throw new Error('CipherKeyringController - keyring id is null');
      }
      if (kr.id in childrenId) {
        kr.children = childrenId[kr.id];
      }
      return kr;
    });
  }

  async displayAllAccounts() {
    const allKeyrings = this.keyrings
      .map(this.displayForKeyring)
      .filter(kr => kr !== null && kr !== undefined);

    const childrenId = this.keyrings.reduce((acc: any, kr) => {
      if (kr?.masterId) {
        if (!(kr.masterId in acc)) {
          acc[kr.masterId] = [];
        }
        acc[kr.masterId].push(kr.getAccounts());
      }
      return acc;
    }, {});
    return allKeyrings.map(kr => {
      if (!kr.id) {
        throw new Error('CipherKeyringController - keyring id is null');
      }
      if (kr.id in childrenId) {
        kr.children = childrenId[kr.id];
      }
      return kr;
    });
  }

  async replaceSimpleKeyAccountToHDWallet({
    mnemonic,
    privateKeys,
    hdPath,
  }: {
    mnemonic: string;
    privateKeys: PrivateKeys;
    hdPath?: { [key: string]: HdPathOpts };
  }) {
    if (!bip39.validateMnemonic(mnemonic)) {
      return Promise.reject(new Error('Seed phrase is invalid.'));
    }

    const existKeyringIdKey = objectToHash(privateKeys);

    const existKeyring =
      this.keyrings.filter(keyring => keyring.id === existKeyringIdKey)?.[0] ??
      undefined;
    if (!existKeyring) {
      throw new Error('CipherKeyringController - not exist duplicate keyring.');
    }

    const keyring = new CipherKeyring({
      type: TYPE_HD_KEY_TREE,
      mnemonic,
      masterId: undefined,
      isTest: this.isTest,
      walletType: WALLETTYPE_MULTY,
      hdPath,
      superMaster: existKeyring.superMaster,
    });

    return Promise.resolve(keyring.getAccounts())
      .then(accounts => {
        if (!accounts) {
          throw new Error('CipherKeyringController - wrong replace process.');
        }

        const availableNum = keyring.getAvailableNumber();
        if (keyring.masterId) {
          const masterKeyring = this.keyrings.filter(kr => {
            return kr.id === keyring.masterId;
          })[0];
          const derivenNumber = 0;
          if (!masterKeyring) {
            throw new Error('does not have master keyring');
          }
          masterKeyring.addNumbersOfChildren(derivenNumber);
        }

        keyring.addNumbersOfChildren(availableNum);
        this.keyrings.push(keyring);
        return keyring.getAccounts();
      })
      .then(accounts => {
        if (!accounts) {
          throw new Error('CipherKeyringController - wrong replace process.');
        }

        if (typeof existKeyring.removeAccount === 'function') {
          const addresses = existKeyring.getAccounts();
          if (addresses.evm) {
            existKeyring.removeAccount(addresses.evm);
          }
        }

        this.removeEmptyKeyrings();

        return undefined;
      })
      .then(() => {
        this.removeEmptyKeyrings();
        return undefined;
      })
      .then(this.persistAllKeyrings.bind(this, undefined))
      .then(this._updateMemStoreKeyrings.bind(this))
      .then(this.fullUpdate.bind(this))
      .then(() => {
        return keyring;
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }
}
