import { addHexPrefix } from '../../scripts/lib/util';
import {
  conversionUtil,
  addCurrencies,
  subtractCurrencies,
} from './conversion.utils';
import { formatCurrency } from './confirm-tx.util';

export const ETH = 'ETH';
export const GWEI = 'GWEI';
export const WEI = 'WEI';

export const PRIMARY = 'PRIMARY';
export const SECONDARY = 'SECONDARY';

export function bnToHex(inputBn: any) {
  return addHexPrefix(inputBn.toString(16));
}

export function hexToDecimal(hexValue: any) {
  return conversionUtil(hexValue, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
  });
}

export function decimalToHex(decimal: any) {
  return conversionUtil(decimal, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
  });
}

export function getEthConversionFromWeiHex({
  value,
  fromCurrency = ETH,
  conversionRate,
  numberOfDecimals = 6,
}: any) {
  const denominations = [fromCurrency, GWEI, WEI];

  let nonZeroDenomination;

  for (let i = 0; i < denominations.length; i++) {
    const convertedValue = getValueFromWeiHex({
      value,
      conversionRate,
      fromCurrency,
      toCurrency: fromCurrency,
      numberOfDecimals,
      toDenomination: denominations[i],
    });

    if (convertedValue !== '0' || i === denominations.length - 1) {
      nonZeroDenomination = `${convertedValue} ${denominations[i]}`;
      break;
    }
  }

  return nonZeroDenomination;
}

export function getValueFromWeiHex({
  value,
  fromCurrency = ETH,
  toCurrency,
  conversionRate,
  numberOfDecimals,
  toDenomination,
}: any) {
  return conversionUtil(value, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromCurrency,
    toCurrency,
    numberOfDecimals,
    fromDenomination: WEI,
    toDenomination,
    conversionRate,
  });
}

export function getWeiHexFromDecimalValue({
  value,
  fromCurrency,
  conversionRate,
  fromDenomination,
  invertConversionRate,
}: any) {
  return conversionUtil(value, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    toCurrency: ETH,
    fromCurrency,
    conversionRate,
    invertConversionRate,
    fromDenomination,
    toDenomination: WEI,
  });
}

export function addHexWEIsToDec(aHexWEI: any, bHexWEI: any) {
  return addCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    fromDenomination: 'WEI',
    numberOfDecimals: 6,
  });
}

export function subtractHexWEIsToDec(aHexWEI: any, bHexWEI: any) {
  return subtractCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    fromDenomination: 'WEI',
    numberOfDecimals: 6,
  });
}

export function decEthToConvertedCurrency(
  ethTotal: any,
  convertedCurrency: any,
  conversionRate: any,
) {
  return conversionUtil(ethTotal, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromCurrency: 'ETH',
    toCurrency: convertedCurrency,
    numberOfDecimals: 2,
    conversionRate,
  });
}

export function decGWEIToHexWEI(decGWEI: any) {
  return conversionUtil(decGWEI, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    fromDenomination: 'GWEI',
    toDenomination: 'WEI',
  });
}

export function hexWEIToDecGWEI(decGWEI: any) {
  return conversionUtil(decGWEI, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromDenomination: 'WEI',
    toDenomination: 'GWEI',
  });
}

export function decETHToDecWEI(decEth: any) {
  return conversionUtil(decEth, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromDenomination: 'ETH',
    toDenomination: 'WEI',
  });
}

export function hexWEIToDecETH(hexWEI: any) {
  return conversionUtil(hexWEI, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromDenomination: 'WEI',
    toDenomination: 'ETH',
  });
}

export function addHexes(aHexWEI: any, bHexWEI: any) {
  return addCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    toNumericBase: 'hex',
    numberOfDecimals: 6,
  });
}

export function subtractHexes(aHexWEI: any, bHexWEI: any) {
  return addCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    toNumericBase: 'hex',
    numberOfDecimals: 6,
  });
}

export function sumHexWEIs(hexWEIs: any) {
  return hexWEIs.filter(Boolean).reduce(addHexes);
}

export function sumHexWEIsToUnformattedFiat(
  hexWEIs: any,
  convertedCurrency: any,
  conversionRate: any,
) {
  const hexWEIsSum = sumHexWEIs(hexWEIs);
  const convertedTotal = decEthToConvertedCurrency(
    getValueFromWeiHex({
      value: hexWEIsSum,
      toCurrency: 'ETH',
      numberOfDecimals: 4,
    }),
    convertedCurrency,
    conversionRate,
  );
  return convertedTotal;
}

export function sumHexWEIsToRenderableFiat(
  hexWEIs: any,
  convertedCurrency: any,
  conversionRate: any,
) {
  const convertedTotal = sumHexWEIsToUnformattedFiat(
    hexWEIs,
    convertedCurrency,
    conversionRate,
  );
  return formatCurrency(convertedTotal, convertedCurrency);
}
