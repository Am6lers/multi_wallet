import {
  AVAX_CHAIN_ID,
  AVAX_TEST_CHAIN_ID,
  BIFROST_CHAIN_ID,
  BSCTEST_CHAIN_ID,
  BSC_CHAIN_ID,
  ChainId,
  MAINNET_CHAIN_ID,
  POLYGON_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
} from '@constants/network';
import Engine from '@core/engine';
import {
  FormattedPriceInfo,
  getFormattedPriceInfo,
} from '@scripts/utils/numbers.utils';
import { getScanUrl } from '@utils/api.utils';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { NATIVE_TOKEN_ADDRESS } from '../../../constants/asset';
import { PricesInfo } from '@scripts/controllers/gasFee';
import { invalidValue } from '../accountAssetTracker';
import { addHexPrefix, isHexString } from 'ethereumjs-util';
import { changeChainIdToHex } from '../walletConnect/tools';
import { BNToHex } from '@utils/number';
import PricesController from '../prices';

export interface GasOracleData {
  LastBlock?: string;
  SafeGasPrice?: string;
  ProposeGasPrice?: string;
  FastGasPrice?: string;
  maxFeePerGas?: FeesData;
  baseFee?: BigNumber;
  maxPriorityFeePerGas?: FeesData;
  waitTime?: EstimatedWaitTime;
}

interface FeesData {
  SafeGasPrice: BigNumber;
  ProposeGasPrice: BigNumber;
  FastGasPrice: BigNumber;
  CustomGasPrice?: any;
}

export interface EstimatedWaitTime {
  SafeGasPrice: {
    min: number;
    max: number;
  };
  ProposeGasPrice: {
    min: number;
    max: number;
  };
  FastGasPrice: {
    min: number;
    max: number;
  };
}

export type GasSpeed =
  | 'SafeGasPrice'
  | 'ProposeGasPrice'
  | 'FastGasPrice'
  | 'CustomGasPrice';
export type ButtonGasSpeed =
  | 'SafeGasPrice'
  | 'ProposeGasPrice'
  | 'FastGasPrice';
export const SafeGasPrice = 'SafeGasPrice';
export const ProposeGasPrice = 'ProposeGasPrice';
export const FastGasPrice = 'FastGasPrice';
export const CustomGasPrice = 'CustomGasPrice';

export interface GasIntegrationInfo {
  selectedGasSpeed: GasSpeed;
  customGas: BigNumber;
  fee: BigNumber;
  feePrice: string;
  gasPrice: BigNumber;
  isUseOracle: boolean;
  supportEIP1559: boolean;
  maxFeePerGas?: BigNumber;
  baseFee?: BigNumber;
  maxPriorityFeePerGas?: BigNumber;
  waitTime?: EstimatedWaitTime;
  info?: {
    gasData: GasOracleData;
    gas: BigNumber;
  };
}

export type ControlType =
  | 'GasLimit'
  | 'GasPrice'
  | 'maxFeePerGas'
  | 'maxPriorityPerGas';

//gwei단위의 수를 eth단위의 수로 수정하는 함수
export const fixUnitOfGasPrice = (newGasPrice: BigNumber) => {
  return newGasPrice.div(new BigNumber(10).pow(9));
};

export const queryString = 'module=gastracker&action=gasoracle';

//oracle의 주소
export const baseUrls: { [key: string]: string } = {
  [MAINNET_CHAIN_ID]: getScanUrl(MAINNET_CHAIN_ID, 'etherscan.io', queryString),
  [BSC_CHAIN_ID]: getScanUrl(BSC_CHAIN_ID, 'bscscan.com', queryString),
  [AVAX_CHAIN_ID]: getScanUrl(AVAX_CHAIN_ID, 'snowtrace.io', queryString),
  [AVAX_TEST_CHAIN_ID]: getScanUrl(
    AVAX_TEST_CHAIN_ID,
    'snowtrace.io',
    queryString,
  ),
  [BSCTEST_CHAIN_ID]: getScanUrl(BSCTEST_CHAIN_ID, 'bscscan.com', queryString),
  [POLYGON_CHAIN_ID]: getScanUrl(
    POLYGON_CHAIN_ID,
    'polygonscan.com',
    queryString,
  ),
  [POLYGON_MUMBAI_CHAIN_ID]: getScanUrl(
    POLYGON_MUMBAI_CHAIN_ID,
    'polygonscan.com',
    queryString,
  ),
};

export const setProperty = (data: GasOracleData, result: any) => {
  const fields: Array<
    'LastBlock' | 'FastGasPrice' | 'ProposeGasPrice' | 'SafeGasPrice'
  > = ['LastBlock', 'FastGasPrice', 'ProposeGasPrice', 'SafeGasPrice'];

  for (const field of fields) {
    if (field === 'LastBlock' && result[field]) {
      data[field] = result[field];
    } else if (result[field]) {
      data[field] = Web3.utils.toWei(result[field], 'Gwei').toString(10);
    }
  }
  return data;
};

//앱에 선택되어있는 금액 단위를 반환하는 함수
const _getCurrencySymbol = (currencyType: string) =>
  currencyType === 'usd' ? '$' : currencyType === 'krw' ? '₩' : '';

//BigNumber를 금액 축약표현의 string으로 변환하는 함수
export const convertBigNumberToPriceString = ({
  price,
  currencyType,
  isShowAllDecimalPlaces = true,
  isShowCurrencyCode = true,
  isAbbreviation = true,
}: {
  price: BigNumber;
  isShowAllDecimalPlaces?: boolean;
  isShowCurrencyCode?: boolean;
  isAbbreviation?: boolean;
  currencyType: string;
}): string => {
  const prefix: string = _getCurrencySymbol(currencyType);

  return `${isShowCurrencyCode ? `${prefix} ` : ''}${
    isShowAllDecimalPlaces
      ? getFormattedPriceInfo({
          value: price.toNumber(),
          shouldUseKmbNotation: isAbbreviation,
        }).refinedPrice
      : getFormattedPriceInfo({
          value: price.toNumber(),
          shouldUseKmbNotation: isAbbreviation,
        }).refinedPrice
  }`;
};

//코인의 balance의 가격을 가져오는 함수
export const getCurrencyPrice = async (
  chainId: ChainId | undefined,
  balances: Array<string>,
  pricesController: PricesController,
): Promise<PricesInfo> => {
  const currencyType = Engine.context.PreferencesController.getCurrencyType();
  const addressAndChainIdPairs = [
    `${NATIVE_TOKEN_ADDRESS}/${chainId}`.toLowerCase(),
  ];

  const invalidPriceInfo: FormattedPriceInfo = {
    currencyCode: currencyType,
    originalPrice: invalidValue.toString(),
    refinedPrice: invalidValue.toString(),
  };
  const invalidTokenPrices: FormattedPriceInfo[] = new Array(
    addressAndChainIdPairs.length,
  ).fill(invalidPriceInfo);
  const invalidPricesInfo: PricesInfo = {
    totalPrice: invalidPriceInfo,
    tokenPrices: invalidTokenPrices,
  };
  if (chainId === undefined) {
    return invalidPricesInfo;
  }

  const notDuplicatedAddressAndChainIdPairsMap: Map<string, boolean> =
    new Map();
  addressAndChainIdPairs.forEach(addressAndChainIdPair => {
    if (!notDuplicatedAddressAndChainIdPairsMap.has(addressAndChainIdPair)) {
      notDuplicatedAddressAndChainIdPairsMap.set(addressAndChainIdPair, true);
    }
  });

  const pricesList = pricesController.getPrices();

  const newFormattedPricesInfo: FormattedPriceInfo[] = [];
  const bnBalances: BigNumber[] = balances.map(
    balance => new BigNumber(balance),
  );

  let totalPrice: BigNumber = new BigNumber(0);
  addressAndChainIdPairs.forEach((addressAndChainIdPair, index) => {
    const balance: BigNumber = bnBalances[index];
    const price: number | undefined =
      pricesList?.[addressAndChainIdPair]?.[currencyType] ?? 0;
    const newTokenPrice: BigNumber = balance.multipliedBy(price ?? 0);
    const formattedPriceInfo: FormattedPriceInfo = getFormattedPriceInfo({
      value: newTokenPrice.toNumber(),
    });

    totalPrice = totalPrice.plus(newTokenPrice);
    newFormattedPricesInfo.push(formattedPriceInfo);
  });
  return {
    totalPrice: getFormattedPriceInfo({
      value: totalPrice.toNumber(),
    }),
    tokenPrices: newFormattedPricesInfo,
  };
};

//priceString을 bigNumber로 바꾸는 함수
export const convertPriceStringToBigNumber = (
  priceString: string,
): BigNumber => {
  const newPriceString: string = priceString
    .replace(',', '')
    .replace('$ ', '')
    .replace('₩ ', '')
    .replace('K', '')
    .replace('M', '')
    .replace('B', '')
    .replace('B', '')
    .replace('T', '')
    .replace('Qa', '')
    .replace('Qi', '')
    .replace(/,/g, '')
    .trim();
  return new BigNumber(newPriceString);
};

export const getTransactionSet = ({
  transactionMeta,
  newGas,
  gasPrice,
  readableValue,
  symbol,
  newData = undefined,
  newValue = undefined,
  maxFeePerGas,
  maxPriorityFeePerGas,
  estimatedBaseFee,
}: {
  transactionMeta: any;
  newGas: string;
  gasPrice: string;
  readableValue: any;
  symbol: string;
  newData?: any;
  newValue?: any;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedBaseFee?: string;
}) => {
  const { data, from, to, value } = transactionMeta.transaction;
  let txData = newData === undefined ? data : newData;
  let txValue =
    newValue === undefined
      ? Web3.utils.numberToHex(value.toString(10))
      : isHexString(newValue)
      ? addHexPrefix(newValue)
      : addHexPrefix(Web3.utils.numberToHex(parseInt(newValue, 10)));
  const isETH = symbol === 'ETH';
  const transactionSet = {
    ...transactionMeta,
    chainId: changeChainIdToHex(transactionMeta.chainId),
    transaction: {
      assetType: symbol,
      data: txData,
      from,
      gas: newGas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      estimatedBaseFee,
      id: transactionMeta.id,
      origin: transactionMeta.origin,
      readableValue:
        readableValue !== '0x0'
          ? BNToHex(readableValue).slice(2)
          : readableValue,
      selectedAsset: { isETH, symbol: symbol },
      symbol,
      to,
      type: 'ETHER_TRANSACTION',
      value: txValue,
    },
  };
  return transactionSet;
};
