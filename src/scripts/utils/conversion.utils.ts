/* Currency Conversion Utility
 * This utility function can be used for converting currency related values within metamask.
 * The caller should be able to pass it a value, along with information about the value's
 * numeric base, denomination and currency, and the desired numeric base, denomination and
 * currency. It should return a single value.
 *
 * @param {(number | string | BN)} value - The value to convert.
 * @param {Object} [options] - Options to specify details of the conversion
 * @param {string} [options.fromCurrency = 'ETH' | 'USD'] - The currency of the passed value
 * @param {string} [options.toCurrency = 'ETH' | 'USD'] - The desired currency of the result
 * @param {string} [options.fromNumericBase = 'hex' | 'dec' | 'BN'] - The numeric basic of the passed value.
 * @param {string} [options.toNumericBase = 'hex' | 'dec' | 'BN'] - The desired numeric basic of the result.
 * @param {string} [options.fromDenomination = 'WEI'] - The denomination of the passed value
 * @param {string} [options.numberOfDecimals] - The desired number of decimals in the result
 * @param {string} [options.roundDown] - The desired number of decimals to round down to
 * @param {number} [options.conversionRate] - The rate to use to make the fromCurrency -> toCurrency conversion
 * @returns {(number | string | BN)}
 *
 * The utility passes value along with the options as a single object to the `converter` function.
 * `converter` conditional modifies the supplied `value` property, depending
 * on the accompanying options.
 */

import BigNumber from 'bignumber.js';
import {BN, stripHexPrefix} from 'ethereumjs-util';

// Big Number Constants
const BIG_NUMBER_WEI_MULTIPLIER = new BigNumber('1000000000000000000');
const BIG_NUMBER_GWEI_MULTIPLIER = new BigNumber('1000000000');
const BIG_NUMBER_ETH_MULTIPLIER = new BigNumber('1');

// Setter Maps
const toBigNumber = {
  hex: (n: any) => new BigNumber(stripHexPrefix(n), 16),
  dec: (n: any) => new BigNumber(String(n), 10),
  BN: (n: any) => new BigNumber(n.toString(16), 16),
};
const toNormalizedDenomination = {
  WEI: (bigNumber: BigNumber) => bigNumber.div(BIG_NUMBER_WEI_MULTIPLIER),
  GWEI: (bigNumber: BigNumber) => bigNumber.div(BIG_NUMBER_GWEI_MULTIPLIER),
  ETH: (bigNumber: BigNumber) => bigNumber.div(BIG_NUMBER_ETH_MULTIPLIER),
};
const toSpecifiedDenomination = {
  WEI: (bigNumber: any) => bigNumber.times(BIG_NUMBER_WEI_MULTIPLIER).round(),
  GWEI: (bigNumber: any) =>
    bigNumber.times(BIG_NUMBER_GWEI_MULTIPLIER).round(9),
  ETH: (bigNumber: any) => bigNumber.times(BIG_NUMBER_ETH_MULTIPLIER).round(9),
};
const baseChange = {
  hex: (n: any) => n.toString(16),
  dec: (n: any) => new BigNumber(n).toString(10),
  BN: (n: any) => new BN(n.toString(16)),
};

// Utility function for checking base types
const isValidBase = (base: number) => {
  return Number.isInteger(base) && base > 1;
};

/**
 * Defines the base type of numeric value
 * @typedef {('hex' | 'dec' | 'BN')} NumericBase
 */

type NumericBase = 'hex' | 'dec' | 'BN';

/**
 * Defines which type of denomination a value is in
 * @typedef {('WEI' | 'GWEI' | 'ETH')} EthDenomination
 */

type EthDenomination = 'WEI' | 'GWEI' | 'ETH';

/**
 * Utility method to convert a value between denominations, formats and currencies.
 * @param {Object} input
 * @param {string | BigNumber} input.value
 * @param {NumericBase} input.fromNumericBase
 * @param {EthDenomination} [input.fromDenomination]
 * @param {string} [input.fromCurrency]
 * @param {NumericBase} input.toNumericBase
 * @param {EthDenomination} [input.toDenomination]
 * @param {string} [input.toCurrency]
 * @param {number} [input.numberOfDecimals]
 * @param {number} [input.conversionRate]
 * @param {boolean} [input.invertConversionRate]
 * @param {string} [input.roundDown]
 */

interface ConverterParams {
  value: any;
  fromNumericBase: NumericBase;
  fromDenomination?: EthDenomination;
  fromCurrency?: string;
  toNumericBase: NumericBase;
  toDenomination?: EthDenomination;
  toCurrency?: string;
  numberOfDecimals?: number;
  conversionRate?: number;
  invertConversionRate?: boolean;
  roundDown?: string;
}

interface ConversionUtilParams {
  fromCurrency?: string;
  toCurrency?: string;
  fromNumericBase: NumericBase;
  toNumericBase: NumericBase;
  fromDenomination?: EthDenomination;
  toDenomination?: EthDenomination;
  numberOfDecimals?: number;
  conversionRate?: number;
  invertConversionRate?: boolean;
}

const converter = ({
  value,
  fromNumericBase,
  fromDenomination,
  fromCurrency,
  toNumericBase,
  toDenomination,
  toCurrency,
  numberOfDecimals,
  conversionRate,
  invertConversionRate,
  roundDown,
}: ConverterParams) => {
  let convertedValue = fromNumericBase
    ? toBigNumber[fromNumericBase](value)
    : value;

  if (fromDenomination) {
    convertedValue = toNormalizedDenomination[fromDenomination](convertedValue);
  }

  if (fromCurrency !== toCurrency) {
    if (conversionRate === null || conversionRate === undefined) {
      throw new Error(
        `Converting from ${fromCurrency} to ${toCurrency} requires a conversionRate, but one was not provided`,
      );
    }
    let rate = toBigNumber.dec(conversionRate);
    if (invertConversionRate) {
      rate = new BigNumber(1.0).div(conversionRate);
    }
    convertedValue = convertedValue.times(rate);
  }

  if (toDenomination) {
    convertedValue = toSpecifiedDenomination[toDenomination](convertedValue);
  }

  if (numberOfDecimals) {
    convertedValue = convertedValue.round(
      numberOfDecimals,
      BigNumber.ROUND_HALF_DOWN,
    );
  }

  if (roundDown) {
    convertedValue = convertedValue.round(roundDown, BigNumber.ROUND_DOWN);
  }

  if (toNumericBase) {
    convertedValue = baseChange[toNumericBase](convertedValue);
  }
  return convertedValue;
};

const conversionUtil = (
  value: any,
  {
    fromCurrency,
    toCurrency = fromCurrency,
    fromNumericBase,
    toNumericBase,
    fromDenomination,
    toDenomination,
    numberOfDecimals,
    conversionRate,
    invertConversionRate,
  }: ConversionUtilParams,
) => {
  if (fromCurrency !== toCurrency && !conversionRate) {
    return 0;
  }
  return converter({
    fromCurrency,
    toCurrency,
    fromNumericBase,
    toNumericBase,
    fromDenomination,
    toDenomination,
    numberOfDecimals,
    conversionRate,
    invertConversionRate,
    value: value || '0',
  });
};

const getBigNumber = (value: any, base: any): BigNumber => {
  if (!isValidBase(base)) {
    throw new Error('Must specificy valid base');
  }

  // We don't include 'number' here, because BigNumber will throw if passed
  // a number primitive it considers unsafe.
  if (typeof value === 'string' || value instanceof BigNumber) {
    return new BigNumber(value, base);
  }

  return new BigNumber(String(value), base);
};

const addCurrencies = (a: any, b: any, options = {}) => {
  const {aBase, bBase, ...conversionOptions}: any = options;

  if (!isValidBase(aBase) || !isValidBase(bBase)) {
    throw new Error('Must specify valid aBase and bBase');
  }

  const value = getBigNumber(a, aBase).plus(getBigNumber(b, bBase));

  return converter({
    value,
    ...conversionOptions,
  });
};

const subtractCurrencies = (a: any, b: any, options = {}) => {
  const {aBase, bBase, ...conversionOptions}: any = options;

  if (!isValidBase(aBase) || !isValidBase(bBase)) {
    throw new Error('Must specify valid aBase and bBase');
  }

  const value = getBigNumber(a, aBase).minus(getBigNumber(b, bBase));

  return converter({
    value,
    ...conversionOptions,
  });
};

const multiplyCurrencies = (a: any, b: any, options = {}) => {
  const {multiplicandBase, multiplierBase, ...conversionOptions}: any = options;

  if (!isValidBase(multiplicandBase) || !isValidBase(multiplierBase)) {
    throw new Error('Must specify valid multiplicandBase and multiplierBase');
  }

  const value = getBigNumber(a, multiplicandBase).times(
    getBigNumber(b, multiplierBase),
  );

  return converter({
    value,
    ...conversionOptions,
  });
};

const conversionGreaterThan = (
  {...firstProps}: ConverterParams,
  {...secondProps}: ConverterParams,
) => {
  const firstValue = converter({...firstProps});
  const secondValue = converter({...secondProps});

  return firstValue.gt(secondValue);
};

const conversionLessThan = (
  {...firstProps}: ConverterParams,
  {...secondProps}: ConverterParams,
) => {
  const firstValue = converter({...firstProps});
  const secondValue = converter({...secondProps});

  return firstValue.lt(secondValue);
};

const conversionMax = (
  {...firstProps}: ConverterParams,
  {...secondProps}: ConverterParams,
) => {
  const firstIsGreater = conversionGreaterThan(
    {...firstProps},
    {...secondProps},
  );

  return firstIsGreater ? firstProps.value : secondProps.value;
};

const conversionGTE = (
  {...firstProps}: ConverterParams,
  {...secondProps}: ConverterParams,
) => {
  const firstValue = converter({...firstProps});
  const secondValue = converter({...secondProps});
  return firstValue.greaterThanOrEqualTo(secondValue);
};

const conversionLTE = (
  {...firstProps}: ConverterParams,
  {...secondProps}: ConverterParams,
) => {
  const firstValue = converter({...firstProps});
  const secondValue = converter({...secondProps});
  return firstValue.lessThanOrEqualTo(secondValue);
};

const toNegative = (n: any, options = {}) => {
  return multiplyCurrencies(n, -1, options);
};

function decGWEIToHexWEI(decGWEI: any) {
  return conversionUtil(decGWEI, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    fromDenomination: 'GWEI',
    toDenomination: 'WEI',
  });
}

export {
  conversionUtil,
  addCurrencies,
  multiplyCurrencies,
  conversionGreaterThan,
  conversionLessThan,
  conversionGTE,
  conversionLTE,
  conversionMax,
  toNegative,
  subtractCurrencies,
  decGWEIToHexWEI,
};