import { EventEmitter } from 'events';
import * as ethUtil from 'ethereumjs-util';
import Wallet, { hdkey } from 'ethereumjs-wallet';
import { payments, networks, Payment, ECPair, Network } from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import objectToHash from 'object-hash';
import {
  normalize,
  decrypt,
  SignTypedDataVersion,
  concatSig,
  personalSign,
  signTypedData,
  getEncryptionPublicKey,
  EthEncryptedData,
  TypedDataV1,
  TypedMessage,
  MessageTypes,
} from '@metamask/eth-sig-util';
import {
  TypeSimpleKeyPair,
  TypeHdKeyTree,
  BIP44Purpose,
  BIP84Purpose,
  HdPathOpts,
  KeyringOpts,
  PrivateKeys,
  Addresses,
  GetPrivateKeyOpts,
  DerivedAccountResult,
} from './types';
import { addHexPrefix } from './utils';
// import Logger from './../../../common/Logger';
/**
 * TYPE
 * - HD Key Tree: 니모닉으로 생성되며, bip32에 따른 계층구조로 파생된 tree구조의 지갑주소들을 생성함
 * - Simple Key Pair: 개인키로 추가된 지갑으로 파생된 구조를 가질 수 없으며, 단일 주소(evm, btc)만 소유함
 */
export const TYPE_SIMPLE_KEY_PAIR: TypeSimpleKeyPair = 'Simple Key Pair';
export const TYPE_HD_KEY_TREE: TypeHdKeyTree = 'HD Key Tree';
const BIP44_PURPOSE: BIP44Purpose = 44;
const BIP84_PURPOSE: BIP84Purpose = 84;

/**
 * EXPORT DATA KEY
 * - evm, btc: evm, btc 계열의 주소 key, master seed(mnemonic, private key)의 key로 사용
 */
export const EVM_KEY = 'evm';
export const BTC_KEY = 'btc';

export const WALLETTYPE_MULTY = 'MULTY';

export default class CipherKeyring extends EventEmitter {
  public type: TypeSimpleKeyPair | TypeHdKeyTree = TYPE_HD_KEY_TREE;
  public superMaster: boolean = false;
  // kering unique key
  public id: string | null = null;
  // parent wallet id
  public masterId: string | null = null;
  public numberOfDeriven = 0;
  public readonly walletType: string = '';
  public readonly numbersOfChildren: Set<number> = new Set();
  public evmWallet: Wallet | null = null;
  public btcWallet: ECPair.ECPairInterface | null = null;
  public evmRoots: hdkey | null = null;
  public btcRoots: bip32.BIP32Interface | null = null;
  public evmDeriveRoots: hdkey | null = null;
  public btcDeriveRoots: bip32.BIP32Interface | null = null;
  public readonly isTest: boolean;
  private mnemonic: string | null = null;
  private seed: string | null = null;
  // private seed: Buffer | null = null;
  public hdPaths: { [key: string]: HdPathOpts } = {
    [EVM_KEY]: {
      purpose: BIP44_PURPOSE,
      coinType: 60,
      account: 0,
      change: 0,
      addressIndex: 0,
    },
    [BTC_KEY]: {
      /*
      // btc path 를 evm path 로 통일하기 위해 인자 변경
      // purpose: BIP84_PURPOSE,
      // coinType: 0,
      */
      purpose: BIP44_PURPOSE,
      coinType: 60,
      account: 0,
      change: 0,
      addressIndex: 0,
    },
  };
  private btcNetwork: Network;

  constructor(opts: KeyringOpts) {
    super();
    this.isTest = Boolean(opts?.isTest);
    this.btcNetwork = this.isTest ? networks.testnet : networks.bitcoin;
    this.superMaster = opts.superMaster ?? false;
    this.type = opts.type;
    if (opts.numberOfDeriven && !isNaN(opts.numberOfDeriven)) {
      this.numberOfDeriven = Number(opts.numberOfDeriven);
    } else {
      this.numberOfDeriven = 0;
    }
    if (Array.isArray(opts.numbersOfChildren)) {
      opts.numbersOfChildren.forEach(num => this.numbersOfChildren.add(num));
    }

    if (
      !this.type ||
      (typeof opts.type === 'string' &&
        ![TYPE_SIMPLE_KEY_PAIR, TYPE_HD_KEY_TREE].includes(this.type))
    ) {
      if (opts.privateKeys) {
        this.type = TYPE_SIMPLE_KEY_PAIR;
      }
      if (opts.mnemonic) {
        this.type = TYPE_HD_KEY_TREE;
      }
    }

    if (opts?.hdPath) {
      if (opts.hdPath?.[EVM_KEY]) {
        this.hdPaths[EVM_KEY] = opts.hdPath[EVM_KEY];
      }
      if (opts.hdPath?.[BTC_KEY]) {
        this.hdPaths[BTC_KEY] = opts.hdPath[BTC_KEY];
      }
    }

    try {
      if (this.type === TYPE_SIMPLE_KEY_PAIR && opts.privateKeys) {
        this.masterId = opts.masterId ?? null;
        this.id = opts.id ?? null;
        this.walletType = opts?.walletType ?? '';
        const keys = opts.privateKeys;
        if (!keys.evm && !keys.btc) {
          throw new Error('Cannot import an empty key.');
        }

        const keysParams = {
          evm:
            typeof keys?.evm === 'string' && keys.evm.length > 60
              ? addHexPrefix(keys.evm)
              : keys.btc
              ? addHexPrefix(keys.btc)
              : null,
          btc:
            typeof keys?.btc === 'string' && keys.btc.length > 60
              ? addHexPrefix(keys.btc)
              : keys.evm
              ? addHexPrefix(keys.evm)
              : null,
        };

        if (keysParams.evm === null && keysParams.btc === null) {
          throw new Error('Cannot import an empty key.');
        }
        const bufferEvm = ethUtil.toBuffer(keysParams.evm);
        const bufferBtc = ethUtil.toBuffer(keysParams.btc);
        if (
          !ethUtil.isValidPrivate(bufferEvm) ||
          !ethUtil.isValidPrivate(bufferBtc)
        ) {
          throw new Error('Cannot import invalid private key.');
        }
        this.deserialize(keysParams);
        // id는 항상 메인넷 주소로 hash한 값
        if (!this.id) {
          this.id = objectToHash(this._getMainnetAccounts());
        }
      } else if (this.type === TYPE_HD_KEY_TREE) {
        this.id = opts.id ?? null;
        this.mnemonic = opts.mnemonic ?? null;
        this.seed = opts.seed ?? null;

        this.walletType = WALLETTYPE_MULTY;
        /*
        // btc path 지원 안하기로하여 test 옵션에 따른 path 변경 로직 삭제
        if (this.isTest) this.hdPaths[BTC_KEY].coinType = 1;
        */
        if (this.seed) {
          // console.log("seed - ")
          this._initRootBySeed(Buffer.from(this.seed, 'hex'));
          this._initDerivedWallet();
          // id는 항상 메인넷 주소로 hash한 값
          if (!this.id) {
            this.id = objectToHash(this._getMainnetAccounts());
          }
        } else if (this.mnemonic) {
          // console.log("mnemonic - ")
          this._initRoot(this.mnemonic);
          this._initDerivedWallet();
          // id는 항상 메인넷 주소로 hash한 값
          if (!this.id) {
            this.id = objectToHash(this._getMainnetAccounts());
          }
        } else {
          if (!this.id) {
            this.id = '';
          }
        }
      } else {
        throw new Error('Invalid keyring type.');
      }
    } catch (e) {
      // Logger.error(e, 'CipherKeyring - constructor:');
    }
  }

  public async serialize(): Promise<KeyringOpts> {
    const keyOpts: KeyringOpts = {
      id: this.id || null,
      type: this.type,
      masterId: this.masterId || undefined,
      numberOfDeriven: this.numberOfDeriven,
      numbersOfChildren:
        this.numbersOfChildren.size > 0
          ? Array.from(this.numbersOfChildren)
          : [],
      walletType: this.walletType,
      hdPath: this.hdPaths,
      superMaster: this.superMaster,
    };

    if (this.type === TYPE_SIMPLE_KEY_PAIR) {
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
          'CipherKeyring - Single Key Pair wallet does not have private key',
        );
      }

      keyOpts.privateKeys = {
        [EVM_KEY]: evmKey,
        [BTC_KEY]: btcKey,
      };
      return keyOpts;
    } else if (this.type === TYPE_HD_KEY_TREE) {
      if (!this.mnemonic) {
        throw new Error(
          'CipherKeyring - HD key tree wallet does not have mnemonic',
        );
      }

      keyOpts.mnemonic = this.mnemonic;
      keyOpts.seed = this.seed ?? undefined;
      return keyOpts;
    } else {
      throw new Error('CipherKeyring - not supported keyring type');
    }
  }

  public deserialize(privateKeys: PrivateKeys): void {
    const evmPrivKey = privateKeys?.[EVM_KEY];
    const btcPrivKey = privateKeys?.[BTC_KEY];

    if (evmPrivKey) {
      const stripped = ethUtil.stripHexPrefix(addHexPrefix(evmPrivKey));
      const buffer = Buffer.from(stripped, 'hex');
      this.evmWallet = Wallet.fromPrivateKey(buffer);
    }

    if (btcPrivKey) {
      const stripped = ethUtil.stripHexPrefix(addHexPrefix(btcPrivKey));
      const buffer = Buffer.from(stripped, 'hex');
      this.btcWallet = ECPair.fromPrivateKey(buffer, {
        network: this.btcNetwork,
      });
    }
  }

  public getAccounts(): Addresses {
    let btcAddress: string | null = null;
    if (this.btcWallet) {
      const p2wpkhParams: Payment = {
        pubkey: this.btcWallet.publicKey,
      };
      if (this.isTest === true) {
        p2wpkhParams.network = this.btcNetwork;
      }
      btcAddress = payments.p2wpkh(p2wpkhParams).address ?? null;
    }
    return {
      [EVM_KEY]: this.evmWallet
        ? normalize(ethUtil.bufferToHex(this.evmWallet.getAddress()))
        : null,
      [BTC_KEY]: btcAddress,
    };
  }

  public getSerializedAccounts(): string {
    const addresses = this.getAccounts();
    let key = '';
    key +=
      addresses[EVM_KEY] && addresses[EVM_KEY] !== '' ? addresses[EVM_KEY] : '';
    key += '/';
    key +=
      addresses[BTC_KEY] && addresses[BTC_KEY] !== '' ? addresses[BTC_KEY] : '';
    return key;
  }
  // test mode id와 product mode id를 일치시키기 위해
  private _getMainnetAccounts(): PrivateKeys {
    let btcAddress: string | null = null;
    if (this.btcWallet) {
      if (this.isTest && this.btcRoots) {
        const btcPath = this.hdPaths[BTC_KEY];
        const derivePath = `m/${btcPath.purpose}'/0'/${btcPath.account}'/${btcPath.change}`;
        const deriveRoot = this.btcRoots.derivePath(derivePath);
        if (!deriveRoot.privateKey) {
          throw new Error('CipherKeyring - derived private key is undefined.');
        }
        const pubkey = ECPair.fromPrivateKey(deriveRoot.privateKey, {
          network: this.isTest ? networks.testnet : networks.bitcoin,
        }).publicKey;

        btcAddress =
          payments.p2wpkh({
            pubkey,
            network: networks.bitcoin,
          }).address ?? null;
      } else {
        btcAddress =
          payments.p2wpkh({
            pubkey: this.btcWallet.publicKey,
            network: networks.bitcoin,
          }).address ?? null;
      }
    }
    return {
      [EVM_KEY]: this.evmWallet
        ? normalize(ethUtil.bufferToHex(this.evmWallet.getAddress()))
        : null,
      [BTC_KEY]: btcAddress,
    };
  }

  public async signTransaction(address: string, tx: any, opts = {}) {
    const privKey = this._getPrivateKeyFor(address, opts);
    const signedTx = tx.sign(privKey);
    return signedTx === undefined ? tx : signedTx;
  }

  public async signMessage(address: string, data: string, opts = {}) {
    const message = ethUtil.stripHexPrefix(data);
    const privKey = this._getPrivateKeyFor(address, opts);
    const msgSig = ethUtil.ecsign(Buffer.from(message, 'hex'), privKey);
    //@ts-ignore
    const rawMsgSig = concatSig(msgSig.v, msgSig.r, msgSig.s);
    return rawMsgSig;
  }

  public async signPersonalMessage(
    address: string,
    msgHex: unknown,
    opts = {},
  ) {
    const privKey = this._getPrivateKeyFor(address, opts);
    const sig = personalSign({ privateKey: privKey, data: msgHex });
    return sig;
  }

  public async decryptMessage(
    withAccount: string,
    encryptedData: EthEncryptedData,
    opts = {},
  ) {
    const wallet = this._getEvmWalletForAccount(withAccount, opts);
    if (!wallet) {
      throw new Error('CipherKeyring - empty evm wallet');
    }
    const privKey = ethUtil.stripHexPrefix(wallet.getPrivateKeyString());
    const sig = decrypt({ encryptedData, privateKey: privKey });
    return sig;
  }

  public async signTypedData(
    withAccount: string,
    typedData: TypedDataV1 | TypedMessage<MessageTypes>,
    opts = { version: SignTypedDataVersion.V1 },
  ) {
    const version = Object.keys(SignTypedDataVersion).includes(opts.version)
      ? opts.version
      : SignTypedDataVersion.V1;

    const privateKey = this._getPrivateKeyFor(withAccount, opts);
    return signTypedData<typeof version, MessageTypes>({
      privateKey,
      data: typedData,
      version,
    });
  }

  public async getEncryptionPublicKey(withAccount: string, opts = {}) {
    const wallet = this._getEvmWalletForAccount(withAccount, opts);
    if (!wallet) {
      throw new Error('CipherKeyring - empty evm wallet');
    }
    const publicKey = getEncryptionPublicKey(wallet.getPrivateKeyString());
    return publicKey;
  }

  protected _getPrivateKeyFor(address: string, opts: GetPrivateKeyOpts = {}) {
    if (!address) {
      throw new Error('Must specify address.');
    }
    const wallet = this._getEvmWalletForAccount(address, opts);
    if (!wallet) {
      throw new Error('CipherKeyring - empty evm wallet');
    }
    return wallet.getPrivateKey();
  }

  public async getAppKeyAddress(address: string, origin: string) {
    if (!origin || typeof origin !== 'string') {
      throw new Error('origin must be a non-empty string');
    }
    const wallet = this._getEvmWalletForAccount(address, {
      withAppKeyOrigin: origin,
    });
    if (!wallet) {
      throw new Error('CipherKeyring - empty evm wallet');
    }
    return normalize(
      ethUtil.publicToAddress(wallet.getPublicKey()).toString('hex'),
    );
  }

  public async exportEvmAccount(address: string, opts = {}) {
    const wallet = this._getEvmWalletForAccount(address, opts);
    if (!wallet) {
      throw new Error('CipherKeyring - empty evm wallet');
    }
    return wallet.getPrivateKeyString();
  }

  public async exportBtcAccount(address: string) {
    const wallet = this._getBtcWalletForAccount(address);
    if (!wallet) {
      throw new Error('CipherKeyring - empty btc wallet');
    }
    return wallet?.privateKey
      ? normalize(ethUtil.bufferToHex(wallet.privateKey))
      : null;
  }

  public setMasterId(masterId: string) {
    this.masterId = masterId;
  }

  public setNumberOfDeriven(num: number) {
    this.numberOfDeriven = num;
  }

  removeAccount(account: string) {
    const address = normalize(account);
    const walletAddress = this.getAccounts();
    if (
      walletAddress[EVM_KEY] === address ||
      walletAddress[BTC_KEY] === account
    ) {
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

  getDerivedAccount(index = 0): DerivedAccountResult {
    if (index < 0) {
      throw new Error('CipherKeyring - index value must be greater than -1 ');
    }
    if (!this.evmDeriveRoots) {
      throw new Error('CipherKeyring - evm derive root is undefined');
    }
    if (!this.btcDeriveRoots) {
      throw new Error('CipherKeyring - btc derive root is undefined');
    }
    const deriveBtcWallet = this.btcDeriveRoots.derive(index);
    const deriveEthWallet = this.evmDeriveRoots.deriveChild(index).getWallet();
    if (!deriveBtcWallet.privateKey || !deriveEthWallet) {
      throw new Error('CipherKeyring - btc derive private key is undefined');
    }

    const params = {
      pubkey: deriveBtcWallet.publicKey,
      network: this.btcNetwork,
    };

    return {
      [EVM_KEY]: deriveEthWallet.getPrivateKeyString(),
      [BTC_KEY]: normalize(ethUtil.bufferToHex(deriveBtcWallet.privateKey)),
      evm_address: normalize(ethUtil.bufferToHex(deriveEthWallet.getAddress())),
      btc_address: payments.p2wpkh(params).address ?? '',
      index,
    };
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
    if (wallet && walletAddress[EVM_KEY] === address) {
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

  private _getBtcWalletForAccount(account: string) {
    const walletAddress = this.getAccounts();
    let wallet: ECPair.ECPairInterface | null = null;
    if (this.btcWallet && walletAddress[BTC_KEY] === account) {
      wallet = this.btcWallet;
    }
    if (!wallet) {
      throw new Error('CipherSimpleKeyring - Unable to find matching address');
    }
    return wallet;
  }

  /* PRIVATE METHODS */

  private _initRoot(mnemonic: string): void {
    this.mnemonic = mnemonic;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // console.log(seed)
    // console.log(typeof seed)
    this.evmRoots = hdkey.fromMasterSeed(seed);
    this.btcRoots = bip32.fromSeed(seed);
  }

  private _initRootBySeed(seed: Buffer): void {
    // console.log(seed)
    // console.log(typeof seed)
    try {
      this.evmRoots = hdkey.fromMasterSeed(seed);
      this.btcRoots = bip32.fromSeed(seed);
    } catch (e: any) {
      console.log('Seed error');
      console.log(e);
    }
  }

  private _initDerivedWallet(): void {
    Object.entries(this.hdPaths).forEach(async ([key, path]) => {
      const p = path;
      const purpose = p.purpose;
      if (key === EVM_KEY) {
        if (!this.evmRoots) {
          throw new Error('CipherKeyring - evm derive root is undefined');
        }

        const derivePath = `m/${purpose}'/${p.coinType}'/${p.account}'/${p.change}`;
        this.evmDeriveRoots = this.evmRoots.derivePath(derivePath);
        this.evmWallet = this.evmDeriveRoots
          .deriveChild(p.addressIndex)
          .getWallet();
      } else if (key === BTC_KEY) {
        if (!this.btcRoots) {
          throw new Error('CipherKeyring - btc derive root is undefined');
        }

        const derivePath = `m/${purpose}'/${p.coinType}'/${p.account}'/${p.change}`;
        this.btcDeriveRoots = this.btcRoots.derivePath(derivePath);
        const btcWallet = this.btcDeriveRoots.derive(p.addressIndex);
        if (btcWallet.privateKey) {
          this.btcWallet = ECPair.fromPrivateKey(btcWallet.privateKey, {
            network: this.isTest ? networks.testnet : networks.bitcoin,
          });
        }
      }
    });
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
