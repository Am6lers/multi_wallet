import currencies from 'currency-formatter/currencies';
import { addHexPrefix, isValidPrivate, toBuffer } from 'ethereumjs-util';
import {
  TransactionMeta,
  TransactionStatus,
} from '../controllers/transaction/CipherMobileTransactionController';
import Web3 from 'web3';
import { TransactionReceipt, TransactionConfig } from 'web3-core';
import { ChainId } from '@constants/network';
import BigNumber from 'bignumber.js';
import {
  BROWSER,
  EvmHistory,
  SUPPORTED_EVM_TOKEN_STANDARDS,
  TokenStandardInfo,
  WALLET_CONNECT,
} from '../controllers/history';
import { logTransactionEvent } from '@utils/firebaseAnalytics.utils';
import Logger, {
  SentryTransactionAction,
  SentryTransactionSendStatus,
  SentryTransactionSendType,
} from '@common/Logger';
import Engine from '@core/engine';

const checkPkRegex = new RegExp('^0?[xX]?[0-9a-fA-F]{64}$');

export function formatCurrency(value: number, currencyCode: string) {
  const upperCaseCurrencyCode = currencyCode.toUpperCase();

  return currencies.find(
    (currency: any) => currency.code === upperCaseCurrencyCode,
  )
    ? new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: upperCaseCurrencyCode,
      }).format(value)
    : value;
}

export function replaceTxHash(data: any) {
  if (typeof data === 'object' && data !== null) {
    const result: any = {};

    for (let key in data) {
      result[key] = replaceTxHash(data[key]);
    }

    return result;
  } else if (typeof data === 'string') {
    if (
      checkPkRegex.test(data) &&
      isValidPrivate(toBuffer(addHexPrefix(data)))
    ) {
      return data.replace(/(.{34})/g, '$1_');
    }
  }

  return data;
}

export const saveTxHistory = async ({
  meta,
  newValue,
  origin,
  isWalletConnect = false,
  network,
  dappName,
  dappIcon,
}: {
  meta: TransactionMeta;
  newValue: string;
  origin: string;
  isWalletConnect: boolean;
  network: any;
  dappName: string;
  dappIcon: string;
}) => {
  //@ts-ignore
  if (typeof meta?.error === 'object') {
    return;
  }
  console.log('Check this meta 000-- ', meta);
  const txId = meta.id;
  const hash = meta.transactionHash;
  const { PreferencesController, HistoryController } = Engine.context;
  const selectedAddress = PreferencesController.getSelectedAddress();
  const numChainId = Web3.utils.hexToNumber(meta.chainId as ChainId);
  const { from, to } = meta.transaction;
  if (!hash || !from || typeof txId !== 'string') {
    return;
  }
  const newTransactionReceipt: TransactionReceipt = {
    status: true,
    transactionHash: hash,
    blockHash: '',
    blockNumber: 0,
    transactionIndex: 0,
    from: from,
    to: to,
    cumulativeGasUsed: 0,
    gasUsed: 0,
    effectiveGasPrice: 0,
    logs: [],
    logsBloom: '',
    contractAddress: '',
    dappInfo: {
      dappName: dappName,
      dappIcon: dappIcon,
    },
  };
  const newTransactionConfig: TransactionConfig = {
    ...meta.transaction,
    chainId: numChainId as number,
    gas: meta.transaction.gas ?? '0x0',
    gasPrice: meta.transaction.gasPrice ?? '0x0',
    data: meta.transaction.data ?? '',
    nonce: meta.transaction.nonce
      ? new BigNumber(meta.transaction.nonce).toNumber()
      : 0,
    value: newValue,
  };
  const newTokenStandardInfo: TokenStandardInfo = {
    type: SUPPORTED_EVM_TOKEN_STANDARDS.ERC20,
    erc20TokenInfo: {
      name: undefined,
      symbol: undefined,
      decimals: undefined,
    },
    erc721TokenInfo: undefined,
    erc1155TokenInfo: undefined,
  };
  const normalizedEvmHistory: EvmHistory =
    await HistoryController.normalizeEvmTransactionReceipt({
      transactionReceipt: newTransactionReceipt,
      transactionConfig: newTransactionConfig,
      tokenStandardInfo: newTokenStandardInfo,
      txId,
      origin: origin || '',
      isWalletConnectOrBrowserTx: isWalletConnect ? WALLET_CONNECT : BROWSER,
    });

  // Refresh EVM histories
  HistoryController.addSentEvmHistory(normalizedEvmHistory);

  await logTransactionEvent({
    action_type: isWalletConnect
      ? SentryTransactionAction.WalletConnect
      : SentryTransactionAction.Browser,
    action_note: `${origin}-${network.name}`,
  });

  // Sentry logging
  // Logger.sendMessageTransactionContext(
  //   {
  //     action: isWalletConnect
  //       ? SentryTransactionAction.WalletConnect
  //       : SentryTransactionAction.Browser,
  //     sendType: SentryTransactionSendType.Empty,
  //     network: network.name ?? '',
  //     walletAddress: selectedAddress,
  //     status:
  //       meta.status === TransactionStatus.confirmed
  //         ? SentryTransactionSendStatus.Confirmed
  //         : meta.status === TransactionStatus.submitted
  //           ? SentryTransactionSendStatus.Submitted
  //           : meta.status === TransactionStatus.failed
  //             ? SentryTransactionSendStatus.Failed
  //             : meta.status === TransactionStatus.rejected
  //               ? SentryTransactionSendStatus.UserCancelled
  //               : SentryTransactionSendStatus.Unknown,
  //     hash: normalizedEvmHistory.hash ?? '',
  //   },
  //   { ...normalizedEvmHistory, transactionMeta: meta },
  // );
};
