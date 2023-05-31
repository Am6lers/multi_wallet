import EventEmitter from 'events';
import {
  Addresses,
  GetPrivateKeyOpts,
  KeyringOpts,
  PrivateKeys,
  TYPE_HD_KEY_TREE,
  TYPE_SIMPLE_KEY_PAIR,
  TypeHdKeyTree,
  TypeSimpleKeyPair,
} from './types';
import * as ethUtil from 'ethereumjs-util';
import { addHexPrefix, normalize } from './utils';
import Wallet, { hdkey } from 'ethereumjs-wallet';
import { payments, Payment, ECPair } from 'bitcoinjs-lib';

export default class MultiKeyring extends EventEmitter {
  public keyringType: TypeSimpleKeyPair | TypeHdKeyTree;
  public id: string | undefined;
  public masterId?: string;
  public numberOfDriven = 0;
  public evmWallet: Wallet | null;
  public btcWallet: ECPair.ECPairInterface;
  public readonly numbersOfChildren: Set<number> = new Set();
  private mnemonic?: string;

  constructor(opts: KeyringOpts) {
    super();
    this.keyringType = opts.keyringType;
    this.id = opts.id;
    this.numberOfDriven = Number(opts.numberOfDriven) ?? 0;
    this.mnemonic = opts.mnemonic;
    if (!opts.numbersOfChildren) {
      this.numbersOfChildren = new Set(opts.numbersOfChildren);
    }
    if (opts.keyringType === TYPE_SIMPLE_KEY_PAIR && opts.privateKeys) {
      this.deserialize(opts.privateKeys);
    }
  }

  public async serialize(): Promise<KeyringOpts> {
    const keyOpts: KeyringOpts = {
      id: this.id,
      keyringType: this.keyringType,
      masterId: this.masterId,
      numberOfDriven: this.numberOfDriven,
      numbersOfChildren: Array.from(this.numbersOfChildren),
    };
    if (this.keyringType === TYPE_SIMPLE_KEY_PAIR) {
      let btcKey: string | null = null;
      let evmKey: string | null = null;
      if (this.btcWallet && this.btcWallet.privateKey) {
        btcKey = this.btcWallet.privateKey.toString('hex');
      }
      if (this.evmWallet) {
        evmKey = this.evmWallet.getPrivateKey().toString('hex');
      }
      if (!btcKey && !evmKey) {
        throw new Error(
          'BiportKeyring - Single Key Pair wallet does not have private key',
        );
      }
      keyOpts.privateKeys = {
        evm: evmKey,
        btc: btcKey,
      };
      return keyOpts;
    } else if (this.keyringType === TYPE_HD_KEY_TREE) {
      if (!this.mnemonic) {
        throw new Error(
          'BiportKeyring - HD key tree wallet does not have mnemonic',
        );
      }

      keyOpts.mnemonic = this.mnemonic;
      return keyOpts;
    } else {
      throw new Error('BiportKeyring - not supported keyring type');
    }
  }

  public deserialize(privateKeys: PrivateKeys): void {
    const evmPrivKey = privateKeys?.evm;
    const btcPrivKey = privateKeys.btc;
    if (evmPrivKey) {
      const strppted = ethUtil.stripHexPrefix(addHexPrefix(evmPrivKey));
      const buffer = Buffer.from(strppted, 'hex');
      this.evmWallet = Wallet.fromPrivateKey(buffer);
    }
    if (btcPrivKey) {
      const stripped = ethUtil.stripHexPrefix(addHexPrefix(btcPrivKey));
      const buffer = Buffer.from(stripped, 'hex');
      this.btcWallet = ECPair.fromPrivateKey(buffer, {});
    }
  }

  public getAccounts(): Addresses {
    // let btcAddress: string | null = null;
    // if (this.btcWallet) {
    //   const p2wpkhParams: Payment = {
    //     pubkey: this.btcWallet.publicKey,
    //   };
    //   btcAddress = payments.p2wpkh(p2wpkhParams).address ?? null;
    // }
    return {
      evm: this.evmWallet
        ? normalize(ethUtil.bufferToHex(this.evmWallet.getAddress()))
        : null,
      btc: null,
    };
  }

  public getSerializedAccounts(): string {
    const addresses = this.getAccounts();
    let key = '';
    key += addresses.evm && addresses.evm !== '' ? addresses.evm : '';
    key += '/';
    key += addresses.btc && addresses.btc !== '' ? addresses.btc : '';
    return key;
  }

  public async signTransaction(address: string, tx: any, opts = {}) {
    const privKey = this._getPrivateKeyFor(address, opts);
    const signedTx = tx.sign(privKey);
    return signedTx === undefined ? tx : signedTx;
  }

  protected _getPrivateKeyFor(address: string, opts: GetPrivateKeyOpts = {}) {
    if (!address) {
      throw new Error('Must specify address.');
    }
    const wallet = this._getEvmWalletForAccount(address, opts);
    if (!wallet) {
      throw new Error('BiportKeyring - empty evm wallet');
    }
    return wallet.getPrivateKey();
  }

  public setMasterId(masterId: string) {
    this.masterId = masterId;
  }

  public setNumberOfDeriven(num: number) {
    this.numberOfDriven = num;
  }

  removeAccount(account: string) {
    const address = normalize(account);
    const walletAddress = this.getAccounts();
    if (walletAddress?.evm === address || walletAddress?.btc === account) {
      this.evmWallet = null;
      this.btcWallet = null;
    }
  }

  removeAccountById(id: string) {
    if (this.id === id) {
      this.evmWallet = null;
      this.btcWallet = null;
    }
  }

  public addNumbersOfChildren(num: number) {
    this.numbersOfChildren.add(num);
  }

  public subNumberOfChildren(num: number) {
    if (this.numbersOfChildren.has(num)) {
      this.numbersOfChildren.delete(num);
    }
  }

  private _getEvmWalletForAccount(
    account: string,
    opts?: GetPrivateKeyOpts,
  ): Wallet | null {
    const address = normalize(account);
    const walletAddress = this.getAccounts();
    let wallet: Wallet | null = this.evmWallet;
    if (wallet && walletAddress.evm === address) {
      if (opts?.withAppKeyOrigin) {
        const privKey = wallet.getPrivateKey();
        const appKeyOriginBuffer = Buffer.from(opts.withAppKeyOrigin, 'utf8');
        const appKeyBuffer = Buffer.concat([privKey, appKeyOriginBuffer]);
        const appKeyPrivKey = ethUtil.keccak(appKeyBuffer, 256);
        wallet = Wallet.fromPrivateKey(appKeyPrivKey);
      }
    }
    return wallet;
  }

  public getAvailableNumber() {
    let availableNum = -1;
    let searchIdx = 0;
    if (this.numbersOfChildren.size === 0) {
      return 0;
    }
    while (availableNum < 0) {
      if (this.numbersOfChildren.has(searchIdx)) {
        searchIdx++;
      } else {
        availableNum = searchIdx;
        break;
      }
    }
    return availableNum;
  }
}
