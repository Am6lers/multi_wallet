import {
  isHexString,
  isValidAddress,
  isValidChecksumAddress,
  addHexPrefix,
} from 'ethereumjs-util';
import { BTC_KEY, EVM_KEY } from '@scripts/controllers/keyring';
import { AddressEntry } from '@scripts/controllers/preferences';

export function isValidHexAddress(
  possibleAddress: string,
  { allowNonPrefixed = true, mixedCaseUseChecksum = false } = {},
) {
  const addressToCheck = allowNonPrefixed
    ? addHexPrefix(possibleAddress)
    : possibleAddress;
  if (!isHexString(addressToCheck)) {
    return false;
  }

  if (mixedCaseUseChecksum) {
    const prefixRemoved = addressToCheck.slice(2);
    const lower = prefixRemoved.toLowerCase();
    const upper = prefixRemoved.toUpperCase();
    const allOneCase = prefixRemoved === lower || prefixRemoved === upper;
    if (!allOneCase) {
      return isValidChecksumAddress(addressToCheck);
    }
  }

  return isValidAddress(addressToCheck);
}

export const addressesObjectToString = (addresses: AddressEntry) => {
  const evm = addresses[EVM_KEY] || '';
  const btc = addresses[BTC_KEY] || '';
  return `${evm}/${btc}`;
};
