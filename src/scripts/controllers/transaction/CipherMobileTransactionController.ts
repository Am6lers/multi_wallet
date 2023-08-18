import {
  MAINNET,
  Network,
  ETH_INFURA_PROVIDER_CHAIN_ID,
} from '@constants/network';
import { EventEmitter } from 'events';
import { addHexPrefix, bufferToHex, BN, isHexString } from 'ethereumjs-util';
import { ethErrors } from 'eth-rpc-errors';
import MethodRegistry from 'eth-method-registry';
import EthQuery from '@utils/eth-query/index';
import Common from '@ethereumjs/common';
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import { v1 as random } from 'uuid';
import { Mutex } from 'async-mutex';
import {
  BaseConfig,
  BaseController,
  BaseState,
  Listener,
} from '@metamask/controllers';
import { BNToHex } from '../../../utils/number';
import { isCustomNetwork } from '@utils/network';
import {
  fractionBN,
  getIncreasedPriceFromExisting,
  handleTransactionFetch,
  hexToBN,
  // isEIP1559Transaction,
  isFeeMarketEIP1559Values,
  isGasPriceValue,
  isSmartContractCode,
  normalizeTransaction,
  query,
  safelyExecute,
  validateGasValues,
  validateMinimumIncrease,
  validateTransaction,
} from '@metamask/controllers/dist/util';
import { NetworkControllerState } from '../network';
import Web3ProviderEngine from '../network/lib/web3-provider-engine';
// import Logger from '@common/Logger';
import { NetworkState } from '../network/model/network';
import Web3 from 'web3';
import { orderBy } from 'lodash';
import CipherPreferencesController from '../preferences';

const HARDFORK = 'london';

export const ESTIMATE_GAS_ERROR = 'eth_estimateGas rpc method error';

export interface TransactionConfig {
  from?: string;
  to?: string;
  value?: number | string;
  gas?: number | string;
  gasPrice?: number | string;
  data?: string;
  nonce?: number | string;
  chainId?: number;
  common?: Common;
  chain?: string;
  hardfork?: string;
  gasLimit?: string;
  maxPriorityFeePerGas?: number | string;
  maxFeePerGas?: number | string;
}

/**
 * @type Result
 * @property result - Promise resolving to a new transaction hash
 * @property transactionMeta - Meta information about this new transaction
 */
export interface Result {
  result: Promise<string>;
  transactionMeta: TransactionMeta;
}

/**
 * @type Fetch All Options
 * @property fromBlock - String containing a specific block decimal number
 * @property etherscanApiKey - API key to be used to fetch token transactions
 */
export interface FetchAllOptions {
  fromBlock?: string;
  etherscanApiKey?: string;
}

export interface AddTxOpts {
  isWalletConnect?: boolean;
  swapHistoryId?: number | null;
}

/**
 * @type Transaction
 *
 * Transaction representation
 * @property chainId - Network ID as per EIP-155
 * @property data - Data to pass with this transaction
 * @property from - Address to send this transaction from
 * @property gas - Gas to send with this transaction
 * @property gasPrice - Price of gas with this transaction
 * @property gasUsed -  Gas used in the transaction
 * @property nonce - Unique number to prevent replay attacks
 * @property to - Address to send this transaction to
 * @property value - Value associated with this transaction
 */
export interface Transaction {
  chainId?: number;
  data?: string;
  from: string;
  gas?: string;
  gasPrice?: string;
  gasUsed?: string;
  nonce?: string;
  to?: string;
  value?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedBaseFee?: string;
  estimateGasError?: string;
}

export interface GasPriceValue {
  gasPrice: string;
}

export interface FeeMarketEIP1559Values {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

/**
 * The status of the transaction. Each status represents the state of the transaction internally
 * in the wallet. Some of these correspond with the state of the transaction on the network, but
 * some are wallet-specific.
 */
export enum TransactionStatus {
  approved = 'approved',
  cancelled = 'cancelled',
  confirmed = 'confirmed',
  failed = 'failed',
  rejected = 'rejected',
  signed = 'signed',
  submitted = 'submitted',
  unapproved = 'unapproved',
}

/**
 * Options for wallet device.
 */
export enum WalletDevice {
  MM_MOBILE = 'metamask_mobile',
  MM_EXTENSION = 'metamask_extension',
  OTHER = 'other_device',
}

type TransactionMetaBase = {
  isTransfer?: boolean;
  transferInformation?: {
    symbol: string;
    contractAddress: string;
    decimals: number;
  };
  id: string;
  networkID?: string;
  chainId?: string;
  origin?: string;
  rawTransaction?: string;
  time: number;
  toSmartContract?: boolean;
  transaction: Transaction;
  transactionHash?: string;
  blockNumber?: string;
  deviceConfirmedOn?: WalletDevice;
  verifiedOnBlockchain?: boolean;
  _cipherchainid?: string;
  swapHistoryId?: number;
  canceledConfirmed?: boolean;
  canceledTransactionHash?: string;
};

/**
 * @type TransactionMeta
 *
 * TransactionMeta representation
 * @property error - Synthesized error information for failed transactions
 * @property id - Generated UUID associated with this transaction
 * @property networkID - Network code as per EIP-155 for this transaction
 * @property origin - Origin this transaction was sent from
 * @property deviceConfirmedOn - string to indicate what device the transaction was confirmed
 * @property rawTransaction - Hex representation of the underlying transaction
 * @property status - String status of this transaction
 * @property time - Timestamp associated with this transaction
 * @property toSmartContract - Whether transaction recipient is a smart contract
 * @property transaction - Underlying Transaction object
 * @property transactionHash - Hash of a successful transaction
 * @property blockNumber - Number of the block where the transaction has been included
 */
export type TransactionMeta =
  | ({
      status: Exclude<TransactionStatus, TransactionStatus.failed>;
    } & TransactionMetaBase)
  | ({ status: TransactionStatus.failed; error: Error } & TransactionMetaBase);

/**
 * @type EtherscanTransactionMeta
 *
 * EtherscanTransactionMeta representation
 * @property blockNumber - Number of the block where the transaction has been included
 * @property timeStamp - Timestamp associated with this transaction
 * @property hash - Hash of a successful transaction
 * @property nonce - Nonce of the transaction
 * @property blockHash - Hash of the block where the transaction has been included
 * @property transactionIndex - Etherscan internal index for this transaction
 * @property from - Address to send this transaction from
 * @property to - Address to send this transaction to
 * @property gas - Gas to send with this transaction
 * @property gasPrice - Price of gas with this transaction
 * @property isError - Synthesized error information for failed transactions
 * @property txreceipt_status - Receipt status for this transaction
 * @property input - input of the transaction
 * @property contractAddress - Address of the contract
 * @property cumulativeGasUsed - Amount of gas used
 * @property confirmations - Number of confirmations
 */
export interface EtherscanTransactionMeta {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  confirmations: string;
  tokenDecimal: string;
  tokenSymbol: string;
}

const isEIP1559Transaction = (transaction: any) => {
  if (transaction) {
    return (
      isHexString(transaction?.maxFeePerGas) &&
      isHexString(transaction?.maxPriorityFeePerGas)
    );
  }
  return false;
};

/**
 * @type TransactionConfig
 *
 * Transaction controller configuration
 * @property interval - Polling interval used to fetch new currency rate
 * @property provider - Provider used to create a new underlying EthQuery instance
 * @property sign - Method used to sign transactions
 */
export interface TransactionConfig extends BaseConfig {
  interval: number;
  sign?: (transaction: Transaction, from: string) => Promise<any>;
  txHistoryLimit: number;
  provider?: Web3ProviderEngine;
}

/**
 * @type MethodData
 *
 * Method data registry object
 * @property registryMethod - Registry method raw string
 * @property parsedRegistryMethod - Registry method object, containing name and method arguments
 */
export interface MethodData {
  registryMethod: string;
  parsedRegistryMethod: Record<string, unknown>;
}

/**
 * @type TransactionState
 *
 * Transaction controller state
 * @property transactions - A list of TransactionMeta objects
 * @property methodData - Object containing all known method data information
 */
export interface TransactionState extends BaseState {
  transactions: TransactionMeta[];
  methodData: { [key: string]: MethodData };
  checkAccount: (address: string) => Promise<boolean>;
}

/**
 * Multiplier used to determine a transaction's increased gas fee during cancellation
 */
export const CANCEL_RATE = 1.5;

/**
 * Multiplier used to determine a transaction's increased gas fee during speed up
 */
export const SPEED_UP_RATE = 1.1;

/**
 * Controller responsible for submitting and managing transactions
 * ether 계열의 토큰 전송, transaction sign 및 제출, 그리고 tracking을 관리하는 컨트롤러입니다.
 */
export class CipherMobileTransactionController extends BaseController<
  TransactionConfig,
  TransactionState
> {
  ethQuery: any;

  private registry: any;

  private handle?: NodeJS.Timer;

  private mutex = new Mutex();

  private getNetworkState: () => Network;

  private getNetworkByChainId: (chainId: string) => NetworkState | null;

  private failTransaction(transactionMeta: TransactionMeta, error: Error) {
    const newTransactionMeta = {
      ...transactionMeta,
      error,
      status: TransactionStatus.failed,
    };
    this.updateTransaction(newTransactionMeta);
    this.hub.emit(`${transactionMeta.id}:finished`, newTransactionMeta);
  }

  private async registryLookup(fourBytePrefix: string): Promise<MethodData> {
    const registryMethod = await this.registry.lookup(fourBytePrefix);
    const parsedRegistryMethod = this.registry.parse(registryMethod);
    return { registryMethod, parsedRegistryMethod };
  }

  /**
   * Normalizes the transaction information from etherscan
   * to be compatible with the TransactionMeta interface.
   *
   * @param txMeta - The transaction.
   * @param currentNetworkID - The current network ID.
   * @param currentChainId - The current chain ID.
   * @returns The normalized transaction.
   */
  private normalizeTx(
    txMeta: EtherscanTransactionMeta,
    currentNetworkID: string,
    currentChainId: string,
  ): TransactionMeta {
    const time = parseInt(txMeta.timeStamp, 10) * 1000;
    const normalizedTransactionBase = {
      blockNumber: txMeta.blockNumber,
      id: random({ msecs: time }),
      networkID: currentNetworkID,
      chainId: currentChainId,
      time,
      transaction: {
        data: txMeta.input,
        from: txMeta.from,
        gas: BNToHex(new BN(txMeta.gas)),
        gasPrice: BNToHex(new BN(txMeta.gasPrice)),
        gasUsed: BNToHex(new BN(txMeta.gasUsed)),
        nonce: BNToHex(new BN(txMeta.nonce)),
        to: txMeta.to,
        value: BNToHex(new BN(txMeta.value)),
      },
      transactionHash: txMeta.hash,
      verifiedOnBlockchain: false,
    };

    /* istanbul ignore else */
    if (txMeta.isError === '0') {
      return {
        ...normalizedTransactionBase,
        status: TransactionStatus.confirmed,
      };
    }

    /* istanbul ignore next */
    return {
      ...normalizedTransactionBase,
      error: new Error('Transaction failed'),
      status: TransactionStatus.failed,
    };
  }

  private normalizeTokenTx = (
    txMeta: EtherscanTransactionMeta,
    currentNetworkID: string,
    currentChainId: string,
  ): TransactionMeta => {
    const time = parseInt(txMeta.timeStamp, 10) * 1000;
    const {
      to,
      from,
      gas,
      gasPrice,
      gasUsed,
      hash,
      contractAddress,
      tokenDecimal,
      tokenSymbol,
      value,
    } = txMeta;
    return {
      id: random({ msecs: time }),
      isTransfer: true,
      networkID: currentNetworkID,
      chainId: currentChainId,
      status: TransactionStatus.confirmed,
      time,
      transaction: {
        chainId: 1,
        from,
        gas,
        gasPrice,
        gasUsed,
        to,
        value,
      },
      transactionHash: hash,
      transferInformation: {
        contractAddress,
        decimals: Number(tokenDecimal),
        symbol: tokenSymbol,
      },
      verifiedOnBlockchain: false,
    };
  };

  private _preferences: CipherPreferencesController;

  /**
   * EventEmitter instance used to listen to specific transactional events
   */
  hub = new EventEmitter();

  /**
   * Name of this controller used during composition
   */
  name = 'TransactionController';

  /**
   * Method used to sign transactions
   */
  sign?: (
    transaction: TypedTransaction,
    from: string,
  ) => Promise<TypedTransaction>;

  /**
   * Creates a TransactionController instance.
   *
   * @param options - The controller options.
   * @param options.getNetworkState - Gets the state of the network controller.
   * @param options.onNetworkStateChange - Allows subscribing to network controller state changes.
   * @param options.getProvider - Returns a provider for the current network.
   * @param config - Initial options used to configure this controller.
   * @param state - Initial state to set on this controller.
   */
  constructor(
    {
      getNetworkState,
      onNetworkStateChange,
      getProvider,
      getNetworkByChainId,
      preferencesController,
    }: {
      getNetworkState: () => Network;
      onNetworkStateChange: (
        listener: Listener<NetworkControllerState>,
      ) => void;
      getProvider: () => any;
      getNetworkByChainId: (chainId: string) => NetworkState | null;
      preferencesController: CipherPreferencesController;
    },
    config?: Partial<TransactionConfig>,
    state?: Partial<TransactionState>,
  ) {
    super(config, state);
    this.defaultConfig = {
      interval: 3000,
      txHistoryLimit: 40,
    };

    this.defaultState = {
      methodData: {},
      transactions: [],
      checkAccount: async () => {
        return false;
      },
    };
    this.initialize();
    const provider = getProvider();
    this.getNetworkState = getNetworkState;
    this.getNetworkByChainId = getNetworkByChainId;
    this.ethQuery = new EthQuery(provider);
    this.registry = new MethodRegistry({ provider });
    this._preferences = preferencesController;
    onNetworkStateChange(() => {
      const newProvider = getProvider();
      this.ethQuery = new EthQuery(newProvider);
      this.registry = new MethodRegistry({ provider: newProvider });
    });
    this.poll();
  }

  /**
   * Starts a new polling interval.
   *
   * @param interval - The polling interval used to fetch new transaction statuses.
   */
  async poll(interval?: number): Promise<void> {
    interval && this.configure({ interval }, false, false);
    this.handle && clearTimeout(this.handle);
    await safelyExecute(() => this.queryTransactionStatuses());
    this.handle = setTimeout(() => {
      this.poll(this.config.interval);
    }, this.config.interval);
  }

  /**
   * Handle new method data request.
   *
   * @param fourBytePrefix - The method prefix.
   * @returns The method data object corresponding to the given signature prefix.
   */
  async handleMethodData(fourBytePrefix: string): Promise<MethodData> {
    const releaseLock = await this.mutex.acquire();
    try {
      const { methodData } = this.state;
      const knownMethod = Object.keys(methodData).find(
        knownFourBytePrefix => fourBytePrefix === knownFourBytePrefix,
      );
      if (knownMethod) {
        return methodData[fourBytePrefix];
      }
      const registry = await this.registryLookup(fourBytePrefix);
      this.update({
        methodData: { ...methodData, ...{ [fourBytePrefix]: registry } },
      });
      return registry;
    } finally {
      releaseLock();
    }
  }

  /**
   * Add a new unapproved transaction to state. Parameters will be validated, a
   * unique transaction id will be generated, and gas and gasPrice will be calculated
   * if not provided. If A `<tx.id>:unapproved` hub event will be emitted once added.
   *
   * @param transaction - The transaction object to add.
   * @param origin - The domain origin to append to the generated TransactionMeta.
   * @param deviceConfirmedOn - An enum to indicate what device the transaction was confirmed to append to the generated TransactionMeta.
   * @param cipherChainId - muti provider chainId
   * @returns Object containing a promise resolving to the transaction hash if approved.
   */
  async addTransaction(
    transaction: Transaction,
    origin?: string,
    deviceConfirmedOn?: WalletDevice,
    cipherChainId?: string,
    opts?: AddTxOpts,
  ): Promise<Result> {
    console.log(
      'addTransaction -------',
      transaction,
      origin,
      cipherChainId,
      opts,
    );
    const { chainId } = this.getNetworkState();
    const { transactions } = this.state;
    transaction = normalizeTransaction(transaction);
    console.log('addTransaction ---?', transaction);
    validateTransaction(transaction);
    const currentChainId = cipherChainId ? cipherChainId : chainId;
    console.log('addTransaction - 0');
    const transactionMeta: TransactionMeta = {
      id: random(),
      networkID: parseInt(currentChainId, 16).toString(),
      chainId: currentChainId,
      origin,
      status: TransactionStatus.unapproved as TransactionStatus.unapproved,
      time: Date.now(),
      transaction,
      deviceConfirmedOn,
      verifiedOnBlockchain: false,
      _cipherchainid: currentChainId,
    };
    console.log('addTransaction - 1');
    if (opts && opts?.swapHistoryId) {
      transactionMeta.swapHistoryId = opts.swapHistoryId;
    }
    console.log('addTransaction - 2');
    try {
      if (!transaction.gas) {
        console.log('addTransaction - 3');
        const { gas, estimateGasError } = await this.estimateGas(
          transaction,
          currentChainId,
        );
        transaction.gas = gas;
        transaction.estimateGasError = estimateGasError;
      }
    } catch (error: any) {
      console.log('addTransaction - 4');
      // Logger.error(error, 'TransactionController: addTransaction');
      this.failTransaction(transactionMeta, error);
      return Promise.reject(error);
    }
    console.log('addTransaction - 5');
    const result: Promise<string> = new Promise((resolve, reject) => {
      this.hub.once(
        `${transactionMeta.id}:finished`,
        (meta: TransactionMeta) => {
          console.log('addTransaction - 6', meta);
          switch (meta.status) {
            case TransactionStatus.submitted:
              return resolve(meta.transactionHash as string);
            case TransactionStatus.rejected:
              return reject(
                ethErrors.provider.userRejectedRequest(
                  'User rejected the transaction',
                ),
              );
            case TransactionStatus.cancelled:
              return reject(
                ethErrors.rpc.internal('User cancelled the transaction'),
              );
            case TransactionStatus.failed:
              return reject(ethErrors.rpc.internal(meta.error.message));
            /* istanbul ignore next */
            default:
              return reject(
                ethErrors.rpc.internal(
                  `MetaMask Tx Signature: Unknown problem: ${JSON.stringify(
                    meta,
                  )}`,
                ),
              );
          }
        },
      );
    });
    console.log('addTransaction - 7');
    transactions.push(transactionMeta);
    console.log('addTransaction - 8');
    this.update({ transactions: this.trimTransactionsForState(transactions) });
    console.log('addTransaction - 9');
    if (opts && opts?.swapHistoryId) {
      this.hub.emit(
        'unapprovedTransaction-crosschainswap',
        transactionMeta,
        opts.swapHistoryId,
      );
    } else if (opts && opts?.isWalletConnect) {
      this.hub.emit('unapprovedTransaction--walletConnect', transactionMeta);
    } else {
      this.hub.emit('unapprovedTransaction', transactionMeta);
    }
    return { result, transactionMeta };
  }

  prepareUnsignedEthTx(
    txParams: Record<string, unknown>,
    currentChainId: string,
  ): TypedTransaction {
    return TransactionFactory.fromTxData(txParams, {
      common: this.getCommonConfiguration(currentChainId),
      freeze: false,
    });
  }

  /**
   * `@ethereumjs/tx` uses `@ethereumjs/common` as a configuration tool for
   * specifying which chain, network, hardfork and EIPs to support for
   * a transaction. By referencing this configuration, and analyzing the fields
   * specified in txParams, @ethereumjs/tx is able to determine which EIP-2718
   * transaction type to use.
   *
   * @returns {Common} common configuration object
   */
  //fix
  getCommonConfiguration(currentChainId: string): Common {
    let name: string | undefined;
    const network = this.getNetworkByChainId(currentChainId);
    if (network) {
      name = network.name;
    }

    const newNetworkId = parseInt(currentChainId, 16);
    console.log(
      'getCommonConfiguration::::',
      network,
      name,
      newNetworkId,
      currentChainId,
    );
    if (!name) {
      throw new Error('No network name.');
    }
    if (ETH_INFURA_PROVIDER_CHAIN_ID.includes(currentChainId)) {
      return new Common({
        chain: newNetworkId, // TODO: test
        hardfork: HARDFORK,
      });
    }
    const customChainParams = {
      name: name ? name.toLowerCase() : undefined,
      chainId: parseInt(currentChainId, 16),
      networkId:
        newNetworkId === null ? NaN : parseInt(String(newNetworkId), undefined),
    };
    console.log('customChainParams::::', customChainParams);
    // return Common.custom(customChainParams);
    return Common.forCustomChain(MAINNET, customChainParams, HARDFORK);
  }

  getTxChainId(controllerChainId: string, txMeta: TransactionMeta): string {
    let currentChainId = controllerChainId;
    if (
      Reflect.has(txMeta, '_cipherchainid') &&
      typeof txMeta._cipherchainid === 'string'
    ) {
      currentChainId = txMeta._cipherchainid;
    }
    return currentChainId;
  }

  /**
   * Approves a transaction and updates it's status in state. If this is not a
   * retry transaction, a nonce will be generated. The transaction is signed
   * using the sign configuration property, then published to the blockchain.
   * A `<tx.id>:finished` hub event is fired after success or failure.
   *
   * @param transactionID - The ID of the transaction to approve.
   */
  async approveTransaction(transactionID: string) {
    const { transactions } = this.state;
    const releaseLock = await this.mutex.acquire();
    const { chainId } = this.getNetworkState();
    const index = transactions.findIndex(({ id }) => transactionID === id);
    const transactionMeta = transactions[index];
    const { nonce } = transactionMeta.transaction;
    const currentChainId = this.getTxChainId(chainId, transactionMeta);
    try {
      const { from } = transactionMeta.transaction;
      if (typeof currentChainId !== 'string') {
        releaseLock();
        this.failTransaction(
          transactionMeta,
          new Error('undefained chain id.'),
        );
        return;
      }
      if (!this.sign) {
        releaseLock();
        this.failTransaction(
          transactionMeta,
          new Error('No sign method defined.'),
        );
        return;
      } else if (!currentChainId) {
        releaseLock();
        this.failTransaction(transactionMeta, new Error('No chainId defined.'));
        return;
      }

      const chainId = parseInt(currentChainId, undefined);
      const { approved: status } = TransactionStatus;

      const txNonce =
        nonce ??
        (await this.getHighestNonce(
          transactionMeta.transaction.from,
          currentChainId,
        ));
      transactionMeta.status = status;
      transactionMeta.transaction.nonce = txNonce;
      transactionMeta.transaction.chainId = chainId;

      const baseTxParams = {
        ...transactionMeta.transaction,
        gasLimit: transactionMeta.transaction.gas,
        chainId,
        nonce: txNonce,
        status,
      };

      const isEIP1559TxData = isEIP1559Transaction(transactionMeta.transaction);

      const latestBlock = await query(
        this.ethQuery.setOpts({ cipherChainId: currentChainId }),
        'getBlockByNumber',
        ['latest', false],
      );

      const isEIP1559Chain = Boolean(
        latestBlock && latestBlock?.baseFeePerGas !== undefined,
      );
      console.log(
        'isEIP1559TxData / isEIP1559Chain',
        isEIP1559TxData,
        isEIP1559Chain,
      );
      const txParams =
        isEIP1559TxData && isEIP1559Chain
          ? {
              ...baseTxParams,
              maxFeePerGas: transactionMeta.transaction.maxFeePerGas,
              maxPriorityFeePerGas:
                transactionMeta.transaction.maxPriorityFeePerGas,
              estimatedBaseFee: transactionMeta.transaction.estimatedBaseFee,
              // specify type 2 if maxFeePerGas and maxPriorityFeePerGas are set
              type: 2,
            }
          : baseTxParams;

      // delete gasPrice if maxFeePerGas and maxPriorityFeePerGas are set
      if (isEIP1559TxData && isEIP1559Chain) {
        console.log('approveTransaction - **&*', JSON.stringify(txParams));
        delete txParams.gasPrice;
      } else {
        delete txParams.maxFeePerGas;
        delete txParams.maxPriorityFeePerGas;
        delete txParams.estimatedBaseFee;
        console.log('approveTransaction - 0', JSON.stringify(txParams));
      }
      console.log('approveTransaction - 00', JSON.stringify(txParams));
      const unsignedEthTx = this.prepareUnsignedEthTx(txParams, currentChainId);
      console.log('approveTransaction - 1', unsignedEthTx);
      const signedTx = await this.sign(unsignedEthTx, from);
      console.log('approveTransaction - 2', signedTx);
      transactionMeta.status = TransactionStatus.signed;
      console.log('approveTransaction - 3', transactionMeta);
      this.updateTransaction(transactionMeta);
      console.log('approveTransaction - 4');
      const rawTransaction = bufferToHex(signedTx.serialize());
      console.log('approveTransaction - 5', rawTransaction);
      transactionMeta.rawTransaction = rawTransaction;
      console.log('approveTransaction - 6', transactionMeta);
      this.updateTransaction(transactionMeta);
      console.log('approveTransaction - 7');
      let transactionHash;
      transactionHash = await query(
        this.ethQuery.setOpts({ cipherChainId: currentChainId }),
        'sendRawTransaction',
        [rawTransaction],
      );
      console.log('approveTransaction - 8', transactionHash);
      transactionMeta.transactionHash = transactionHash;
      transactionMeta.status = TransactionStatus.submitted;
      this.updateTransaction(transactionMeta);
      this.hub.emit(`${transactionMeta.id}:finished`, transactionMeta);
    } catch (error: any) {
      console.log('approveTransaction - err', error);
      this.failTransaction(transactionMeta, error);
      // Logger.error(error, 'TransactionController: approveTransaction');
    } finally {
      releaseLock();
    }
  }

  /**
   * Cancels a transaction based on its ID by setting its status to "rejected"
   * and emitting a `<tx.id>:finished` hub event.
   *
   * @param transactionID - The ID of the transaction to cancel.
   */
  cancelTransaction(transactionID: string) {
    const transactionMeta = this.state.transactions.find(
      ({ id }) => id === transactionID,
    );
    if (!transactionMeta) {
      return;
    }
    transactionMeta.status = TransactionStatus.rejected;
    this.hub.emit(`${transactionMeta.id}:finished`, transactionMeta);
    const transactions = this.state.transactions.filter(
      ({ id }) => id !== transactionID,
    );
    this.update({ transactions: this.trimTransactionsForState(transactions) });
  }

  /**
   * Attempts to cancel a transaction based on its ID by setting its status to "rejected"
   * and emitting a `<tx.id>:finished` hub event.
   *
   * @param transactionID - The ID of the transaction to cancel.
   * @param gasValues - The gas values to use for the cancellation transation.
   */
  async stopTransaction(
    transactionID: string,
    gasValues?: GasPriceValue | FeeMarketEIP1559Values,
  ) {
    if (gasValues) {
      validateGasValues(gasValues);
    }
    const transactionMeta = this.state.transactions.find(
      ({ id }) => id === transactionID,
    );
    if (!transactionMeta) {
      return;
    }
    const { chainId } = this.getNetworkState();
    const txChainId = this.getTxChainId(chainId, transactionMeta);
    if (!txChainId) {
      throw new Error('Undefined chain id.');
    }
    if (!this.sign) {
      throw new Error('No sign method defined.');
    }
    if (transactionMeta.status !== TransactionStatus.submitted) {
      throw new Error('UNSUBMITTED');
    }
    const [currTxMeta, isConfirmed] =
      await this.blockchainTransactionStateReconciler(transactionMeta);

    if (isConfirmed) {
      throw new Error('CONFIRMED');
    }
    // gasPrice (legacy non EIP1559)
    const minGasPrice = getIncreasedPriceFromExisting(
      transactionMeta.transaction.gasPrice,
      CANCEL_RATE,
    );
    const gasPriceFromValues = isGasPriceValue(gasValues) && gasValues.gasPrice;
    const newGasPrice =
      (gasPriceFromValues &&
        validateMinimumIncrease(gasPriceFromValues, minGasPrice)) ||
      minGasPrice;
    // maxFeePerGas (EIP1559)
    const existingMaxFeePerGas = transactionMeta.transaction?.maxFeePerGas;
    const minMaxFeePerGas = getIncreasedPriceFromExisting(
      existingMaxFeePerGas,
      CANCEL_RATE,
    );
    const maxFeePerGasValues =
      isFeeMarketEIP1559Values(gasValues) && gasValues.maxFeePerGas;
    const newMaxFeePerGas =
      (maxFeePerGasValues &&
        validateMinimumIncrease(maxFeePerGasValues, minMaxFeePerGas)) ||
      (existingMaxFeePerGas && minMaxFeePerGas);

    // maxPriorityFeePerGas (EIP1559)
    const existingMaxPriorityFeePerGas =
      transactionMeta.transaction?.maxPriorityFeePerGas;
    const minMaxPriorityFeePerGas = getIncreasedPriceFromExisting(
      existingMaxPriorityFeePerGas,
      CANCEL_RATE,
    );
    const maxPriorityFeePerGasValues =
      isFeeMarketEIP1559Values(gasValues) && gasValues.maxPriorityFeePerGas;
    const newMaxPriorityFeePerGas =
      (maxPriorityFeePerGasValues &&
        validateMinimumIncrease(
          maxPriorityFeePerGasValues,
          minMaxPriorityFeePerGas,
        )) ||
      (existingMaxPriorityFeePerGas && minMaxPriorityFeePerGas);

    const txParams =
      newMaxFeePerGas && newMaxPriorityFeePerGas
        ? {
            from: transactionMeta.transaction.from,
            gasLimit: transactionMeta.transaction.gas,
            maxFeePerGas: newMaxFeePerGas,
            maxPriorityFeePerGas: newMaxPriorityFeePerGas,
            type: 2,
            nonce: transactionMeta.transaction.nonce,
            to: transactionMeta.transaction.from,
            value: '0x0',
          }
        : {
            from: transactionMeta.transaction.from,
            gasLimit: transactionMeta.transaction.gas,
            gasPrice: newGasPrice,
            nonce: transactionMeta.transaction.nonce,
            to: transactionMeta.transaction.from,
            value: '0x0',
          };
    const unsignedEthTx = this.prepareUnsignedEthTx(txParams, txChainId);
    const signedTx = await this.sign(
      unsignedEthTx,
      transactionMeta.transaction.from,
    );
    const rawTransaction = bufferToHex(signedTx.serialize());
    const canceledTxHash = await query(
      this.ethQuery.setOpts({ cipherChainId: txChainId }),
      'sendRawTransaction',
      [rawTransaction],
    );
    transactionMeta.status = TransactionStatus.cancelled;
    transactionMeta.canceledTransactionHash = canceledTxHash;
    this.hub.emit(`${transactionMeta.id}:finished`, transactionMeta);
  }

  /**
   * Attempts to speed up a transaction increasing transaction gasPrice by ten percent.
   *
   * @param transactionID - The ID of the transaction to speed up.
   * @param gasValues - The gas values to use for the speed up transation.
   */
  async speedUpTransaction(
    transactionID: string,
    gasValues?: GasPriceValue | FeeMarketEIP1559Values,
  ) {
    if (gasValues) {
      validateGasValues(gasValues);
    }
    const transactionMeta = this.state.transactions.find(
      ({ id }) => id === transactionID,
    );
    /* istanbul ignore next */
    if (!transactionMeta) {
      return;
    }
    const { chainId } = this.getNetworkState();
    const txChainId = this.getTxChainId(chainId, transactionMeta);
    if (!txChainId) {
      throw new Error('Undefined chain id.');
    }

    /* istanbul ignore next */
    if (!this.sign) {
      throw new Error('No sign method defined.');
    }

    const { transactions } = this.state;

    // gasPrice (legacy non EIP1559)
    const minGasPrice = getIncreasedPriceFromExisting(
      transactionMeta.transaction.gasPrice,
      SPEED_UP_RATE,
    );

    const gasPriceFromValues = isGasPriceValue(gasValues) && gasValues.gasPrice;

    const newGasPrice =
      (gasPriceFromValues &&
        validateMinimumIncrease(gasPriceFromValues, minGasPrice)) ||
      minGasPrice;

    // maxFeePerGas (EIP1559)
    const existingMaxFeePerGas = transactionMeta.transaction?.maxFeePerGas;
    const minMaxFeePerGas = getIncreasedPriceFromExisting(
      existingMaxFeePerGas,
      SPEED_UP_RATE,
    );
    const maxFeePerGasValues =
      isFeeMarketEIP1559Values(gasValues) && gasValues.maxFeePerGas;
    const newMaxFeePerGas =
      (maxFeePerGasValues &&
        validateMinimumIncrease(maxFeePerGasValues, minMaxFeePerGas)) ||
      (existingMaxFeePerGas && minMaxFeePerGas);

    // maxPriorityFeePerGas (EIP1559)
    const existingMaxPriorityFeePerGas =
      transactionMeta.transaction?.maxPriorityFeePerGas;
    const minMaxPriorityFeePerGas = getIncreasedPriceFromExisting(
      existingMaxPriorityFeePerGas,
      SPEED_UP_RATE,
    );
    const maxPriorityFeePerGasValues =
      isFeeMarketEIP1559Values(gasValues) && gasValues.maxPriorityFeePerGas;
    const newMaxPriorityFeePerGas =
      (maxPriorityFeePerGasValues &&
        validateMinimumIncrease(
          maxPriorityFeePerGasValues,
          minMaxPriorityFeePerGas,
        )) ||
      (existingMaxPriorityFeePerGas && minMaxPriorityFeePerGas);

    const txParams =
      newMaxFeePerGas && newMaxPriorityFeePerGas
        ? {
            ...transactionMeta.transaction,
            gasLimit: transactionMeta.transaction.gas,
            maxFeePerGas: newMaxFeePerGas,
            maxPriorityFeePerGas: newMaxPriorityFeePerGas,
            type: 2,
          }
        : {
            ...transactionMeta.transaction,
            gasLimit: transactionMeta.transaction.gas,
            gasPrice: newGasPrice,
          };

    const unsignedEthTx = this.prepareUnsignedEthTx(txParams, txChainId);

    const signedTx = await this.sign(
      unsignedEthTx,
      transactionMeta.transaction.from,
    );
    const rawTransaction = bufferToHex(signedTx.serialize());
    const transactionHash = await query(
      this.ethQuery.setOpts({ cipherChainId: txChainId }),
      'sendRawTransaction',
      [rawTransaction],
    );
    const baseTransactionMeta = {
      ...transactionMeta,
      id: random(),
      time: Date.now(),
      transactionHash,
    };
    const newTransactionMeta =
      newMaxFeePerGas && newMaxPriorityFeePerGas
        ? {
            ...baseTransactionMeta,
            transaction: {
              ...transactionMeta.transaction,
              maxFeePerGas: newMaxFeePerGas,
              maxPriorityFeePerGas: newMaxPriorityFeePerGas,
            },
          }
        : {
            ...baseTransactionMeta,
            transaction: {
              ...transactionMeta.transaction,
              gasPrice: newGasPrice,
            },
          };
    transactions.push(newTransactionMeta);
    this.update({ transactions: this.trimTransactionsForState(transactions) });
    this.hub.emit(`${transactionMeta.id}:speedup`, newTransactionMeta);
  }

  //fix!!
  /**
   * Estimates required gas for a given transaction.
   *
   * @param transaction - The transaction to estimate gas for.
   * @returns The gas and gas price.
   */
  async estimateGas(transaction: Transaction, cipherChainId: string) {
    const estimatedTransaction = { ...transaction };
    const {
      gas,
      gasPrice: providedGasPrice,
      to,
      value,
      data,
    } = estimatedTransaction;
    const gasPrice =
      typeof providedGasPrice === 'undefined'
        ? await query(
            this.ethQuery.setOpts({ cipherChainId: cipherChainId }),
            'gasPrice',
          )
        : providedGasPrice;
    const isCustomChain = isCustomNetwork(cipherChainId);
    // 1. If gas is already defined on the transaction, use it
    if (typeof gas !== 'undefined') {
      return { gas, gasPrice };
    }
    const latestBlock = await query(
      this.ethQuery.setOpts({ cipherChainId: cipherChainId }),
      'getBlockByNumber',
      ['latest', false],
    );
    const { gasLimit } = latestBlock;
    // 2. If to is not defined or this is not a contract address, and there is no data use 0x5208 / 21000.
    // If the newtwork is a custom network then bypass this check and fetch 'estimateGas'.
    /* istanbul ignore next */
    const code = to
      ? await query(
          this.ethQuery.setOpts({ cipherChainId: cipherChainId }),
          'getCode',
          [to],
        )
      : undefined;
    /* istanbul ignore next */
    if (!isCustomChain && (!to || (to && !data && (!code || code === '0x')))) {
      return { gas: '0x5208', gasPrice };
    }

    // if data, should be hex string format
    estimatedTransaction.data = !data
      ? data
      : /* istanbul ignore next */ addHexPrefix(data);

    // 3. If this is a contract address, safely estimate gas using RPC
    estimatedTransaction.value =
      typeof value === 'undefined' ? '0x0' : /* istanbul ignore next */ value;
    const gasLimitBN = hexToBN(gasLimit);
    estimatedTransaction.gas = BNToHex(fractionBN(gasLimitBN, 19, 20));

    let gasHex;
    let estimateGasError: string | undefined;
    try {
      gasHex = await query(
        this.ethQuery.setOpts({ cipherChainId: cipherChainId }),
        'estimateGas',
        [estimatedTransaction],
      );
    } catch (error) {
      estimateGasError = ESTIMATE_GAS_ERROR;
    }
    // 4. Pad estimated gas without exceeding the most recent block gasLimit. If the network is a
    // a custom network then return the eth_estimateGas value.
    const gasBN = hexToBN(gasHex);
    const maxGasBN = gasLimitBN.muln(0.9);
    const paddedGasBN = gasBN.muln(1.5);
    /* istanbul ignore next */
    if (gasBN.gt(maxGasBN) || isCustomChain) {
      return { gas: addHexPrefix(gasHex), gasPrice, estimateGasError };
    }

    /* istanbul ignore next */
    if (paddedGasBN.lt(maxGasBN)) {
      return {
        gas: addHexPrefix(BNToHex(paddedGasBN)),
        gasPrice,
        estimateGasError,
      };
    }
    return { gas: addHexPrefix(BNToHex(maxGasBN)), gasPrice };
  }

  /**
   * Check the status of submitted transactions on the network to determine whether they have
   * been included in a block. Any that have been included in a block are marked as confirmed.
   */
  async queryTransactionStatuses() {
    const { transactions } = this.state;
    const selectedAddress = (
      this._preferences.getSelectedAddress() ?? ''
    ).toLowerCase();
    if (!selectedAddress || selectedAddress === '') {
      return;
    }

    let gotUpdates = false;
    await safelyExecute(() =>
      Promise.all(
        transactions.map(async (meta, index) => {
          // Using fallback to networkID only when there is no chainId present.
          // Should be removed when networkID is completely removed.
          const isSendTx =
            (meta.transaction?.from ?? '').toLowerCase() === selectedAddress;

          if (
            !meta.verifiedOnBlockchain &&
            meta.chainId &&
            meta._cipherchainid &&
            meta.transaction.to &&
            isSendTx
          ) {
            const [reconciledTx, updateRequired] =
              await this.blockchainTransactionStateReconciler(meta);
            if (updateRequired) {
              transactions[index] = reconciledTx;
              gotUpdates = updateRequired;
            }
          }
        }),
      ),
    );

    /* istanbul ignore else */
    if (gotUpdates) {
      this.update({
        transactions: this.trimTransactionsForState(transactions),
      });
    }
  }

  /**
   * Updates an existing transaction in state.
   *
   * @param transactionMeta - The new transaction to store in state.
   */
  updateTransaction(transactionMeta: TransactionMeta) {
    const { transactions } = this.state;
    transactionMeta.transaction = normalizeTransaction(
      transactionMeta.transaction,
    );
    validateTransaction(transactionMeta.transaction);
    const index = transactions.findIndex(({ id }) => transactionMeta.id === id);
    transactions[index] = transactionMeta;
    this.update({ transactions: this.trimTransactionsForState(transactions) });
  }

  /**
   * Removes all transactions from state, optionally based on the current network.
   *
   * @param ignoreNetwork - Determines whether to wipe all transactions, or just those on the
   * current network. If `true`, all transactions are wiped.
   */
  wipeTransactions(ignoreNetwork?: boolean) {
    /* istanbul ignore next */
    if (ignoreNetwork) {
      this.update({ transactions: [] });
      return;
    }
    const { chainId: currentChainId, networkId: currentNetworkID } =
      this.getNetworkState();
    const newTransactions = this.state.transactions.filter(
      ({ networkID, chainId }) => {
        // Using fallback to networkID only when there is no chainId present. Should be removed when networkID is completely removed.
        const isCurrentNetwork =
          chainId === currentChainId ||
          (!chainId && networkID === currentNetworkID);
        return !isCurrentNetwork;
      },
    );

    this.update({
      transactions: this.trimTransactionsForState(newTransactions),
    });
  }

  /**
   * get unapproved Transaction
   */
  getLatestUnapprovedTransactions(opts: {
    origin?: string;
    status?: TransactionStatus;
  }) {
    const { transactions } = this.state;
    const keywordOrigin = opts?.origin || undefined;
    const keywordStatus = opts?.status || undefined;
    const filteredTxs = (transactions ?? []).filter(
      (txMeta: TransactionMeta) => {
        if (keywordOrigin && keywordStatus) {
          return (
            txMeta.origin === keywordOrigin && txMeta.status === keywordStatus
          );
        } else if (keywordOrigin) {
          return txMeta.origin === keywordOrigin;
        } else if (keywordStatus) {
          return txMeta.status === keywordStatus;
        }
      },
    );
    const orderedTxs = orderBy(filteredTxs, ['time'], ['desc']);
    return orderedTxs && orderedTxs?.length > 0 ? orderedTxs[0] : undefined;
  }

  /**
   * Get transactions from Etherscan for the given address. By default all transactions are
   * returned, but the `fromBlock` option can be given to filter just for transactions from a
   * specific block onward.
   *
   * @param address - The address to fetch the transactions for.
   * @param opt - Object containing optional data, fromBlock and Etherscan API key.
   * @returns The block number of the latest incoming transaction.
   */
  async fetchAll(
    address: string,
    opt?: FetchAllOptions,
  ): Promise<string | void> {
    const {
      chainId: currentChainId,
      name: networkType,
      networkId: currentNetworkID = '1',
    } = this.getNetworkState();
    const { transactions } = this.state;
    const supportedNetworkIds = ['1', '3', '4', '42'];
    /* istanbul ignore next */
    if (supportedNetworkIds.indexOf(currentNetworkID) === -1) {
      return undefined;
    }

    const [etherscanTxResponse, etherscanTokenResponse] =
      await handleTransactionFetch(
        networkType,
        address,
        this.config.txHistoryLimit,
        opt,
      );

    const normalizedTxs = etherscanTxResponse.result.map(
      (tx: EtherscanTransactionMeta) =>
        this.normalizeTx(tx, currentNetworkID, currentChainId),
    );
    const normalizedTokenTxs = etherscanTokenResponse.result.map(
      (tx: EtherscanTransactionMeta) =>
        this.normalizeTokenTx(tx, currentNetworkID, currentChainId),
    );

    const [updateRequired, allTxs] = this.etherscanTransactionStateReconciler(
      [...normalizedTxs, ...normalizedTokenTxs],
      transactions,
    );

    allTxs.sort((a, b) => (a.time < b.time ? -1 : 1));

    let latestIncomingTxBlockNumber: string | undefined;
    allTxs.forEach(async tx => {
      /* istanbul ignore next */
      if (
        // Using fallback to networkID only when there is no chainId present. Should be removed when networkID is completely removed.
        (tx.chainId === currentChainId ||
          (!tx.chainId && tx.networkID === currentNetworkID)) &&
        tx.transaction.to &&
        tx.transaction.to.toLowerCase() === address.toLowerCase()
      ) {
        if (
          tx.blockNumber &&
          (!latestIncomingTxBlockNumber ||
            parseInt(latestIncomingTxBlockNumber, 10) <
              parseInt(tx.blockNumber, 10))
        ) {
          latestIncomingTxBlockNumber = tx.blockNumber;
        }
      }

      /* istanbul ignore else */
      if (tx.toSmartContract === undefined) {
        // If not `to` is a contract deploy, if not `data` is send eth
        if (
          tx.transaction.to &&
          (!tx.transaction.data || tx.transaction.data !== '0x')
        ) {
          const code = await query(
            this.ethQuery.setOpts({ cipherChainId: tx.chainId }),
            'getCode',
            [tx.transaction.to],
          );
          tx.toSmartContract = isSmartContractCode(code);
        } else {
          tx.toSmartContract = false;
        }
      }
    });

    // Update state only if new transactions were fetched or
    // the status or gas data of a transaction has changed
    if (updateRequired) {
      this.update({ transactions: this.trimTransactionsForState(allTxs) });
    }
    return latestIncomingTxBlockNumber;
  }

  /**
   * Trim the amount of transactions that are set on the state. Checks
   * if the length of the tx history is longer then desired persistence
   * limit and then if it is removes the oldest confirmed or rejected tx.
   * Pending or unapproved transactions will not be removed by this
   * operation. For safety of presenting a fully functional transaction UI
   * representation, this function will not break apart transactions with the
   * same nonce, created on the same day, per network. Not accounting for transactions of the same
   * nonce, same day and network combo can result in confusing or broken experiences
   * in the UI. The transactions are then updated using the BaseController update.
   *
   * @param transactions - The transactions to be applied to the state.
   * @returns The trimmed list of transactions.
   */
  private trimTransactionsForState(
    transactions: TransactionMeta[],
  ): TransactionMeta[] {
    const nonceNetworkSet = new Set();
    const txsToKeep = transactions.reverse().filter(tx => {
      const { chainId, networkID, status, transaction, time } = tx;
      if (transaction) {
        const key = `${transaction.nonce}-${chainId ?? networkID}-${new Date(
          time,
        ).toDateString()}`;
        if (nonceNetworkSet.has(key)) {
          return true;
        } else if (
          nonceNetworkSet.size < this.config.txHistoryLimit ||
          !this.isFinalState(status)
        ) {
          nonceNetworkSet.add(key);
          return true;
        }
      }
      return false;
    });
    txsToKeep.reverse();
    return txsToKeep;
  }

  /**
   * Determines if the transaction is in a final state.
   *
   * @param status - The transaction status.
   * @returns Whether the transaction is in a final state.
   */
  private isFinalState(status: TransactionStatus): boolean {
    return (
      status === TransactionStatus.rejected ||
      status === TransactionStatus.confirmed ||
      status === TransactionStatus.failed ||
      status === TransactionStatus.cancelled
    );
  }

  getFinishedLocalNonces(walletAddress: string, chainId: string) {
    const { transactions } = this.state;
    const currentAccountTransactions = (transactions ?? []).filter(
      tx =>
        tx.transaction?.from === walletAddress &&
        tx.chainId === chainId &&
        this.isFinalState(tx.status),
    );

    const localNonces = currentAccountTransactions.map(tx => {
      const { nonce } = tx.transaction;
      return parseInt(nonce ?? '0', 16);
    });

    return localNonces;
  }

  /**
   * Method to verify the state of a transaction using the Blockchain as a source of truth.
   *
   * @param meta - The local transaction to verify on the blockchain.
   * @returns A tuple containing the updated transaction, and whether or not an update was required.
   */
  private async blockchainTransactionStateReconciler(
    meta: TransactionMeta,
  ): Promise<[TransactionMeta, boolean]> {
    const { status, transactionHash, transaction } = meta;
    const { chainId } = this.getNetworkState();
    const txChainId = this.getTxChainId(chainId, meta);
    switch (status) {
      case TransactionStatus.confirmed:
        const txReceipt = await query(
          this.ethQuery.setOpts({ cipherChainId: txChainId }),
          'getTransactionReceipt',
          [transactionHash],
        );

        if (!txReceipt) {
          return [meta, false];
        }

        meta.verifiedOnBlockchain = true;
        meta.transaction.gasUsed = txReceipt.gasUsed;

        // According to the Web3 docs:
        // TRUE if the transaction was successful, FALSE if the EVM reverted the transaction.
        if (Number(txReceipt.status) === 0) {
          const error: Error = new Error(
            'Transaction failed. The transaction was reversed',
          );
          this.failTransaction(meta, error);
          return [meta, false];
        }

        return [meta, true];
      case TransactionStatus.submitted:
        const txObj = await query(
          this.ethQuery.setOpts({ cipherChainId: txChainId }),
          'getTransactionByHash',
          [transactionHash],
        );

        if (!txObj) {
          const receiptShowsFailedStatus =
            await this.checkTxReceiptStatusIsFailed(transactionHash, txChainId);

          // Case the txObj is evaluated as false, a second check will
          // determine if the tx failed or it is pending or confirmed
          if (receiptShowsFailedStatus) {
            const error: Error = new Error(
              'Transaction failed. The transaction was dropped or replaced by a new one',
            );
            this.failTransaction(meta, error);
          } else {
            if (transaction?.nonce) {
              const localNonces = this.getFinishedLocalNonces(
                transaction.from,
                txChainId,
              );
              const numNonce = parseInt(transaction.nonce, 16);
              if (
                localNonces.length > 0 &&
                (localNonces.includes(numNonce) ||
                  Math.max(...localNonces) > numNonce)
              ) {
                const error: Error = new Error(
                  'Transaction failed. The transaction was dropped or replaced by a new one',
                );
                this.failTransaction(meta, error);
              }
            }
          }
        }

        /* istanbul ignore next */
        if (txObj?.blockNumber) {
          meta.status = TransactionStatus.confirmed;
          this.hub.emit(`${meta.id}:confirmed`, meta);
          this.hub.emit('transactionConfirmed', meta);

          return [meta, true];
        }

        return [meta, false];
      case TransactionStatus.cancelled:
        if (!meta?.canceledConfirmed && meta?.canceledTransactionHash) {
          const txReceiptForCanceled = await query(
            this.ethQuery.setOpts({ cipherChainId: txChainId }),
            'getTransactionReceipt',
            [meta.canceledTransactionHash],
          );

          if (txReceiptForCanceled) {
            meta.verifiedOnBlockchain = true;
            meta.transaction.gasUsed = txReceiptForCanceled.gasUsed;
            meta.canceledConfirmed = true;

            if (Number(txReceiptForCanceled.status) === 0) {
              const error: Error = new Error(
                'Transaction failed. The transaction was reversed',
              );
              this.failTransaction(meta, error);
              this.hub.emit(`${meta.id}:cancel-confirmed`, meta);
              return [meta, false];
            }

            this.hub.emit(`${meta.id}:cancel-confirmed`, meta);
            return [meta, true];
          } else {
            const originTxReceipt = await query(
              this.ethQuery.setOpts({ cipherChainId: txChainId }),
              'getTransactionReceipt',
              [meta.transactionHash],
            );

            if (originTxReceipt) {
              meta.verifiedOnBlockchain = true;
              meta.transaction.gasUsed = originTxReceipt.gasUsed;
              delete meta.canceledConfirmed;
              delete meta.canceledTransactionHash;
              if (Number(originTxReceipt.status) === 0) {
                const error: Error = new Error(
                  'Transaction failed. The transaction was reversed',
                );
                this.failTransaction(meta, error);
                return [meta, false];
              } else if (Number(originTxReceipt.status) === 1) {
                meta.status = TransactionStatus.confirmed;
                this.hub.emit(`${meta.id}:cancel-confirmed`, meta);
                this.hub.emit('transactionConfirmed', meta);

                return [meta, true];
              }
            }
          }
        }

        return [meta, false];
      default:
        return [meta, false];
    }
  }

  /**
   * Method to check if a tx has failed according to their receipt
   * According to the Web3 docs:
   * TRUE if the transaction was successful, FALSE if the EVM reverted the transaction.
   * The receipt is not available for pending transactions and returns null.
   *
   * @param txHash - The transaction hash.
   * @returns Whether the transaction has failed.
   */
  private async checkTxReceiptStatusIsFailed(
    txHash: string | undefined,
    txChainId: string,
  ): Promise<boolean> {
    const txReceipt = await query(
      this.ethQuery.setOpts({ cipherChainId: txChainId }),
      'getTransactionReceipt',
      [txHash],
    );
    if (!txReceipt) {
      // Transaction is pending
      return false;
    }
    return Number(txReceipt.status) === 0;
  }

  /**
   * Method to verify the state of transactions using Etherscan as a source of truth.
   *
   * @param remoteTxs - Transactions to reconcile that are from a remote source.
   * @param localTxs - Transactions to reconcile that are local.
   * @returns A tuple containing a boolean indicating whether or not an update was required, and the updated transaction.
   */
  private etherscanTransactionStateReconciler(
    remoteTxs: TransactionMeta[],
    localTxs: TransactionMeta[],
  ): [boolean, TransactionMeta[]] {
    const updatedTxs: TransactionMeta[] = this.getUpdatedTransactions(
      remoteTxs,
      localTxs,
    );

    const newTxs: TransactionMeta[] = this.getNewTransactions(
      remoteTxs,
      localTxs,
    );

    const updatedLocalTxs = localTxs.map((tx: TransactionMeta) => {
      const txIdx = updatedTxs.findIndex(
        ({ transactionHash }) => transactionHash === tx.transactionHash,
      );
      return txIdx === -1 ? tx : updatedTxs[txIdx];
    });

    const updateRequired = newTxs.length > 0 || updatedLocalTxs.length > 0;

    return [updateRequired, [...newTxs, ...updatedLocalTxs]];
  }

  /**
   * Get all transactions that are in the remote transactions array
   * but not in the local transactions array.
   *
   * @param remoteTxs - Array of transactions from remote source.
   * @param localTxs - Array of transactions stored locally.
   * @returns The new transactions.
   */
  private getNewTransactions(
    remoteTxs: TransactionMeta[],
    localTxs: TransactionMeta[],
  ): TransactionMeta[] {
    return remoteTxs.filter(tx => {
      const alreadyInTransactions = localTxs.find(
        ({ transactionHash }) => transactionHash === tx.transactionHash,
      );
      return !alreadyInTransactions;
    });
  }

  /**
   * Get all the transactions that are locally outdated with respect
   * to a remote source (etherscan or blockchain). The returned array
   * contains the transactions with the updated data.
   *
   * @param remoteTxs - Array of transactions from remote source.
   * @param localTxs - Array of transactions stored locally.
   * @returns The updated transactions.
   */
  private getUpdatedTransactions(
    remoteTxs: TransactionMeta[],
    localTxs: TransactionMeta[],
  ): TransactionMeta[] {
    return remoteTxs.filter(remoteTx => {
      const isTxOutdated = localTxs.find(localTx => {
        return (
          remoteTx.transactionHash === localTx.transactionHash &&
          this.isTransactionOutdated(remoteTx, localTx)
        );
      });
      return isTxOutdated;
    });
  }

  /**
   * Verifies if a local transaction is outdated with respect to the remote transaction.
   *
   * @param remoteTx - The remote transaction from Etherscan.
   * @param localTx - The local transaction.
   * @returns Whether the transaction is outdated.
   */
  private isTransactionOutdated(
    remoteTx: TransactionMeta,
    localTx: TransactionMeta,
  ): boolean {
    const statusOutdated = this.isStatusOutdated(
      remoteTx.transactionHash,
      localTx.transactionHash,
      remoteTx.status,
      localTx.status,
    );
    const gasDataOutdated = this.isGasDataOutdated(
      remoteTx.transaction.gasUsed,
      localTx.transaction.gasUsed,
    );
    return statusOutdated || gasDataOutdated;
  }

  /**
   * Verifies if the status of a local transaction is outdated with respect to the remote transaction.
   *
   * @param remoteTxHash - Remote transaction hash.
   * @param localTxHash - Local transaction hash.
   * @param remoteTxStatus - Remote transaction status.
   * @param localTxStatus - Local transaction status.
   * @returns Whether the status is outdated.
   */
  private isStatusOutdated(
    remoteTxHash: string | undefined,
    localTxHash: string | undefined,
    remoteTxStatus: TransactionStatus,
    localTxStatus: TransactionStatus,
  ): boolean {
    return remoteTxHash === localTxHash && remoteTxStatus !== localTxStatus;
  }

  /**
   * Verifies if the gas data of a local transaction is outdated with respect to the remote transaction.
   *
   * @param remoteGasUsed - Remote gas used in the transaction.
   * @param localGasUsed - Local gas used in the transaction.
   * @returns Whether the gas data is outdated.
   */
  private isGasDataOutdated(
    remoteGasUsed: string | undefined,
    localGasUsed: string | undefined,
  ): boolean {
    return remoteGasUsed !== localGasUsed;
  }

  async getHighestNonce(walletAddress: string, chainId: string) {
    const networkNonce = await query(
      this.ethQuery.setOpts({ cipherChainId: chainId }),
      'getTransactionCount',
      [Web3.utils.toChecksumAddress(walletAddress), 'pending'],
    );

    const latestNonce = await query(
      this.ethQuery.setOpts({ cipherChainId: chainId }),
      'getTransactionCount',
      [Web3.utils.toChecksumAddress(walletAddress), 'latest'],
    );

    if (
      Web3.utils.hexToNumber(networkNonce) > Web3.utils.hexToNumber(latestNonce)
    ) {
      return networkNonce;
    } else {
      return latestNonce;
    }

    // return networkNonce;
  }
}

export default CipherMobileTransactionController;
