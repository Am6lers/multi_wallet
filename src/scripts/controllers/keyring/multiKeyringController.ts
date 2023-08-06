import * as bip39 from 'bip39';
// @ts-ignore
import encryptor from 'browser-passworder';
import { toBuffer, isValidPrivate, unpadHexString } from 'ethereumjs-util';
import { networks, ECPair } from 'bitcoinjs-lib';
import EventEmitter from 'events';
import {
  TYPE_SIMPLE_KEY_PAIR,
  TYPE_HD_KEY_TREE,
  DisplayKeyring,
  Addresses,
  AdditionalAccountResult,
  UnlockError,
} from './types';
import { normalize } from '@metamask/eth-sig-util';
import { ObservableStore } from '@metamask/obs-store';
import { KeyringOpts, PrivateKeys } from './types';
import { addHexPrefix, isInvalidAccount } from './utils';
import { BaseController, BaseConfig, BaseState } from '@metamask/controllers';
import MultiKeyring from './mutiKeyring';
import objectToHash from 'object-hash';

export const EVM_KEY = 'evm';
export const BTC_KEY = 'btc';

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
 * biport 지갑의 계정의 생성 및 추가 그리고 암호화 및 복호화를 관리합니다.
 */

export default class MultiKeyringController extends BaseController<
  BaseConfig,
  KeyringState
> {
  name = 'KeyringController';

  public keyringTypes = [TYPE_SIMPLE_KEY_PAIR, TYPE_HD_KEY_TREE];
  public store: any;
  public memStore: any;
  protected encryptor: any;
  protected keyrings: MultiKeyring[];
  protected password: string | null | undefined = null;
  public isTest = false;

  hub = new EventEmitter();

  constructor(opts: KeyringParam) {
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

  public createNewVaultAndRestore(password: string, seed: string) {
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
          keyringType: TYPE_HD_KEY_TREE,
          mnemonic: seed,
        });
      })
      .then(firstKeyring => {
        return firstKeyring.getAccounts();
      })
      .then(account => {
        console.log('account:', account);
        if (isInvalidAccount(account)) {
          throw new Error('MultiKeyringController - First Account not found.');
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
      typeof privateKeys.evm === 'string' ? privateKeys.evm : null;
    const btcPrivateKey: string | null =
      typeof privateKeys.evm === 'string' ? privateKeys.evm : null;
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
          keyringType: TYPE_SIMPLE_KEY_PAIR,
          privateKeys: { evm: evmPrivateKey, btc: btcPrivateKey },
          masterId: undefined,
          id: '',
          numberOfDriven: 0,
          numbersOfChildren: [],
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

  public importAccountWithSeed(mnemonic: string) {
    if (!bip39.validateMnemonic(mnemonic)) {
      return Promise.reject(new Error('Seed phrase is invalid.'));
    }
    return this.addNewKeyring({
      keyringType: TYPE_HD_KEY_TREE,
      mnemonic,
      masterId: undefined,
    })
      .then(keyring => {
        return keyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error('MultiKeyringController - First Account not found.');
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
    const keyring = new MultiKeyring(opts);
    const { keyrings } = this.memStore.getState();

    const newKeyringAccounts = keyring.getAccounts();
    let duplicate = false;
    keyrings.forEach((kr: DisplayKeyring) => {
      const evmDup = Boolean(
        kr.accounts?.evm &&
          newKeyringAccounts?.evm &&
          kr.accounts.evm === newKeyringAccounts.evm,
      );
      // const btcDup = Boolean(
      //   kr.accounts?.btc &&
      //     newKeyringAccounts?.btc &&
      //     kr.accounts.btc === newKeyringAccounts.btc,
      // );
      if (evmDup) {
        duplicate = true;
      }
    });

    if (duplicate) {
      throw new Error('added duplicate account.');
    }
    return Promise.resolve(keyring.getAccounts())
      .then(accounts => {
        return this.checkForDuplicate(opts.keyringType, accounts);
      })
      .then(() => {
        const availableNum = keyring.getAvailableNumber();
        if (keyring.masterId) {
          const masterKeyring = this.keyrings.filter(kr => {
            return kr.id === keyring.masterId;
          })[0];
          const derivenNumber = opts.numberOfDriven
            ? Number(opts.numberOfDriven)
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
    const validKeyrings: MultiKeyring[] = [];

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
              accounts.evm.find(
                key =>
                  key === accountPrivateKeys.evm ||
                  key === unpadHexString(accountPrivateKeys.evm ?? ''),
              ),
            ) ||
            Boolean(accounts.btc.find(key => key === accountPrivateKeys.btc));
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

  public getAllKeyrings() {
    return this.memStore.getState().keyrings;
  }

  removeAccount(address: string) {
    let masterId: string | null = null;
    let numberOfDeriven = 0;
    return this.getKeyringForAccount(address)
      .then(keyring => {
        // Not all the keyrings support this, so we have to check
        if (typeof keyring.removeAccount === 'function') {
          masterId = keyring.masterId || null;
          numberOfDeriven = keyring.numberOfDriven;
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
            `Keyring ${keyring.keyringType} doesn't support account removal operations`,
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

  async createFirstKeyTree() {
    this.clearKeyrings();
    return this.addNewKeyring({ keyringType: TYPE_HD_KEY_TREE })
      .then(keyring => {
        return keyring.getAccounts();
      })
      .then(account => {
        if (isInvalidAccount(account)) {
          throw new Error(
            'MultiKeyringController - No account found on keychain.',
          );
        }
        return null;
      });
  }

  persistAllKeyrings(password = this.password) {
    if (typeof password !== 'string') {
      return Promise.reject(
        new Error('MultiKeyringController - password is not a string'),
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

  async unlockKeyrings(password: string): Promise<MultiKeyring[]> {
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
    const keyring = new MultiKeyring(options);
    this.keyrings.push(keyring);
    return keyring;
  }

  async getAccounts() {
    const keyrings = this.keyrings || [];
    const accountRes: { [key: string]: any[] } = {
      evm: [],
      btc: [],
    };
    return await Promise.all(keyrings.map(kr => kr.getAccounts())).then(
      keyringArrays => {
        return keyringArrays.reduce((res, arr) => {
          if (typeof arr.evm === 'string') {
            res.evm.push(arr.evm);
          }
          if (typeof arr.btc === 'string') {
            res.btc.push(arr.btc);
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
          if (arr.evm && typeof arr.evm === 'string') {
            res.push(arr.evm);
          }
          return res;
        }, accountRes);
      },
    );
  }

  getKeyringsByType(type: string) {
    return this.keyrings.filter(keyring => keyring.keyringType === type);
  }

  async getKeyringForAccount(address: string): Promise<MultiKeyring> {
    const hexed = normalize(address);

    return Promise.all(
      this.keyrings.map(keyring => {
        return Promise.all([keyring, keyring.getAccounts()]);
      }),
    ).then(candidates => {
      const winners = candidates.filter(candidate => {
        const evmAddress = candidate[1]?.evm;
        const btcAddress = candidate[1]?.btc;
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
        const evmAddress = candidate[1]?.evm;
        const btcAddress = candidate[1]?.btc;
        return evmAddress === hexed || btcAddress === address;
      });
      if (!winners || !winners.length || !winners[0] || !winners[0][0]) {
        return false;
      }
      const keyring = winners[0][0];
      return keyring ? true : false;
    });
  }

  displayForKeyring(keyring: MultiKeyring): DisplayKeyring {
    const keys = keyring.getAccounts();
    return {
      id: keyring.id || null,
      masterId: keyring.masterId || null,
      type: keyring.keyringType,
      accounts: {
        evm: keys.evm,
        btc: keys.btc,
      },
      numberOfDeriven: keyring.numberOfDriven,
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
        keyring.accounts.evm === hexed || keyring.accounts.btc === address,
    );
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
        throw new Error('MultiKeyringController - keyring id is null');
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
        throw new Error('MultiKeyringController - keyring id is null');
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
  }: {
    mnemonic: string;
    privateKeys: PrivateKeys;
  }) {
    if (!bip39.validateMnemonic(mnemonic)) {
      return Promise.reject(new Error('Seed phrase is invalid.'));
    }

    const existKeyringIdKey = objectToHash(privateKeys);

    const existKeyring =
      this.keyrings.filter(keyring => keyring.id === existKeyringIdKey)?.[0] ??
      undefined;
    if (!existKeyring) {
      throw new Error('MultiKeyringController - not exist duplicate keyring.');
    }

    const keyring = new MultiKeyring({
      keyringType: TYPE_HD_KEY_TREE,
      mnemonic,
      masterId: undefined,
    });

    return Promise.resolve(keyring.getAccounts())
      .then(accounts => {
        if (!accounts) {
          throw new Error('MultiKeyringController - wrong replace process.');
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
          throw new Error('MultiKeyringController - wrong replace process.');
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
