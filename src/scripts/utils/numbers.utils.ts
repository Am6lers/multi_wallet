import BigNumber from 'bignumber.js';
import { store } from '../../store';
import {
  BALANCE_LONG_DECIMAL_PLACES,
  BALANCE_SHORT_DECIMAL_PLACES,
  PRICE_DECIMAL_PLACES,
} from '../../constants/tokens';

export interface FormattedPriceInfo {
  currencyCode: string;
  originalPrice: string;
  refinedPrice: string;
  nonCurrencyPrice: string;
}

export interface FormattedBalanceInfo {
  originalBalance: string;
  refinedBalance: string;
}

export const shortenAddress = (
  address: string,
  cntBothSides: number = 4,
  dilimiter: string = '...',
): string =>
  address.substring(0, cntBothSides) +
  dilimiter +
  address.substring(address.length - cntBothSides, address.length);

export const getBalancesString = ({
  value,
  shouldUseKmbNotation = true,
  shouldShowShortDecimalPlaces = true,
}: {
  value: number;
  shouldUseKmbNotation?: boolean;
  shouldShowShortDecimalPlaces?: boolean;
}): string => {
  const decimalPlaces: number = shouldShowShortDecimalPlaces
    ? BALANCE_SHORT_DECIMAL_PLACES
    : BALANCE_LONG_DECIMAL_PLACES;

  return refineNumber({
    value,
    decimalPlaces,
    shouldUseKmbNotation,
  });
};

export const getFormattedBalanceInfo = ({
  value,
  shouldUseKmbNotation,
}: {
  value: number;
  shouldUseKmbNotation?: boolean;
}): FormattedBalanceInfo => {
  const currencyType: 'usd' | 'krw' =
    store.getState()?.engine?.backgroundState?.PreferencesController
      ?.currencyType ?? 'usd';
  shouldUseKmbNotation = currencyType === 'usd';

  const formattedBalanceInfo: FormattedBalanceInfo = {
    originalBalance: value.toString(10),
    refinedBalance: refineNumber({
      value,
      decimalPlaces: shouldUseKmbNotation ? PRICE_DECIMAL_PLACES : 0,
      shouldUseKmbNotation,
      shouldUseCommaNotation: currencyType === 'krw',
    }),
  };

  return formattedBalanceInfo;
};

export const getFormattedBalance = ({ value }: { value: number }) => {
  const valueBn = new BigNumber(value ?? undefined);
  if (valueBn.isNaN()) {
    return '-';
  }
  const number_str = valueBn.toString(10);
  const decimal_index = number_str.indexOf('.');
  const integerPart = valueBn.abs().dp(0, BigNumber.ROUND_FLOOR).toString(10);
  const decimalDigits = number_str.substring(decimal_index + 1);
  if (decimal_index === -1) {
    return new BigNumber(integerPart).toString(10); // 소수점이 없는 경우
  } else {
    for (let i = 0; i < decimalDigits.length; i++) {
      if (decimalDigits[i] !== '0') {
        const formattedDecimal = decimalDigits.substring(0, i);
        let valueText;
        if (value && Number(value) >= 0) {
          if (valueBn.isGreaterThanOrEqualTo(1)) {
            valueText = valueBn.toFixed(3, BigNumber.ROUND_FLOOR);
          } else {
            valueText = valueBn.toFixed(
              formattedDecimal.length + 3,
              BigNumber.ROUND_FLOOR,
            );
          }
          return valueText;
        } else {
          return '-';
        }
      }
    }
  }
};

export const getAmountTextMaxLength = ({ value }: { value: number }) => {
  if (!value) {
    return 1;
  }
  const text = getFormattedBalance({ value });
  if (!text) {
    return 1;
  }
  return text?.length;
};

export const getAmountDecimalLength = ({ value }: { value: number }) => {
  if (!value) {
    return 0;
  }
  const text = getFormattedBalance({ value });
  if (!text || text === '-') {
    return 0;
  }

  if (text?.indexOf('.') > -1) {
    const decimalPart = text.split('.')?.[1];
    return decimalPart.length;
  } else {
    return 0;
  }
};

export const getFormattedPriceInfo = ({
  value,
  shouldUseKmbNotation,
  customDecimal,
}: {
  value: number;
  shouldUseKmbNotation?: boolean;
  customDecimal?: number;
}): FormattedPriceInfo => {
  const currencyType: 'usd' | 'krw' =
    store.getState()?.engine?.backgroundState?.PreferencesController
      ?.currencyType ?? 'usd';
  const currencyCode: string = convertFiatSignal(currencyType);
  shouldUseKmbNotation = currencyType === 'usd';

  let decimal = shouldUseKmbNotation ? PRICE_DECIMAL_PLACES : 0;
  decimal =
    typeof customDecimal === 'number' && customDecimal >= 0
      ? customDecimal
      : decimal;

  const formattedPriceInfo: FormattedPriceInfo = {
    currencyCode: currencyCode,
    originalPrice: value.toString(),
    refinedPrice: `${currencyCode} ${
      currencyType == 'usd'
        ? Number(value)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : Math.floor(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // refineNumber({
      //   value,
      //   decimalPlaces: decimal,
      //   shouldUseKmbNotation,
      //   shouldUseCommaNotation: currencyType === 'krw',
      // })
    }`,
    nonCurrencyPrice: `${
      currencyType == 'usd'
        ? new BigNumber(value)
            .toFixed(2, BigNumber.ROUND_FLOOR)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : Math.floor(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }`,
    // `${refineNumber({
    //   value,
    //   decimalPlaces: decimal,
    //   shouldUseKmbNotation,
    //   shouldUseCommaNotation: currencyType === 'krw',
    // })}`,
  };

  return formattedPriceInfo;
};

export const getPriceTextMaxLength = ({ value }: { value: number }) => {
  if (!value) {
    return 1;
  }
  const allText = getFormattedPriceInfo({ value }).nonCurrencyPrice;
  console.log('allText --- ', allText);
  if (!allText) {
    return 1;
  }
  return allText?.length;
};

export const convertFiatSignal = (currencyType?: 'usd' | 'krw') => {
  let sig = '';
  switch (currencyType) {
    case 'usd':
      sig = '$';
      break;
    case 'krw':
      sig = '₩';
      break;
    default:
      break;
  }
  return sig;
};

const refineNumber = ({
  value,
  decimalPlaces,
  shouldUseKmbNotation,
  shouldUseCommaNotation = false,
}: {
  value: number;
  decimalPlaces: number;
  shouldUseKmbNotation: boolean;
  shouldUseCommaNotation?: boolean;
}): string => {
  const bnValue: BigNumber = new BigNumber(value);

  // Abbreviate number (http://musicfamily.org/realm/Notation/)
  if (shouldUseKmbNotation) {
    const step: number = 3;
    const notations: string[] = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
    let notationIndex: number = 0;
    let newValueString: string = new BigNumber(value)
      .dp(decimalPlaces, BigNumber.ROUND_DOWN)
      .toString(10);
    for (let exponent = 0; exponent <= 15; exponent += step) {
      const lowerBound: BigNumber = new BigNumber(10).pow(exponent);
      const upperBound: BigNumber = new BigNumber(10).pow(exponent + step);
      if (
        bnValue.isGreaterThanOrEqualTo(lowerBound) &&
        bnValue.isLessThan(upperBound)
      ) {
        notationIndex = Math.floor(exponent / step);
        if (notationIndex <= 1) {
          break;
        }
        newValueString = bnValue
          .dividedBy(lowerBound)
          .dp(decimalPlaces, BigNumber.ROUND_DOWN)
          .toString(10);
        break;
      }
    }
    return notationIndex <= 1
      ? newValueString
      : (shouldUseCommaNotation
          ? new Intl.NumberFormat('en-US').format(Number(newValueString))
          : newValueString) + notations[notationIndex];
  } else {
    const refinedValue: number = bnValue
      .dp(decimalPlaces, BigNumber.ROUND_DOWN)
      .toNumber();
    if (refinedValue >= 1) {
      return shouldUseCommaNotation
        ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
            refinedValue,
          )
        : refinedValue.toString();
    } else {
      return shouldUseCommaNotation
        ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(
            refinedValue,
          )
        : refinedValue.toString();
    }
  }
};

export const getDecimalPosition = (bigFee: BigNumber | undefined) => {
  if (!bigFee) {
    return 0;
  }
  if (bigFee.isGreaterThanOrEqualTo(1)) {
    return 2;
  }
  const fee = bigFee.toString();
  const decimalString = fee.split('.')[1];
  if (!decimalString) {
    return 0;
  }

  const nonZeroIndex = decimalString.search(/[1-9]/);
  if (nonZeroIndex === -1) {
    return 0;
  }

  return nonZeroIndex + 3;
};

export function changeChainIdToHex(chainId: string | number) {
  let num;
  if (typeof chainId === 'string') {
    num = parseInt(chainId);
  } else {
    num = chainId;
  }
  return `0x${num.toString(16)}`;
}
