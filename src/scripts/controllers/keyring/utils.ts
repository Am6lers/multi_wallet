import { PrivateKeys } from './types';

export function isInvalidAccount(account: PrivateKeys): boolean {
  return !account?.evm && !account?.btc;
}

export const addHexPrefix = (str: string) => {
  if (typeof str !== 'string' || str.match(/^-?0x/u)) {
    return str;
  }

  if (str.match(/^-?0X/u)) {
    return str.replace('0X', '0x');
  }

  if (str.startsWith('-')) {
    return str.replace('-', '-0x');
  }

  return `0x${str}`;
};

export const toString = (mnemonic: string | number[] | Buffer): string => {
  if (typeof mnemonic === 'string') {
    return mnemonic;
  } else if (Array.isArray(mnemonic)) {
    return Buffer.from(mnemonic).toString('utf8');
  } else {
    return mnemonic.toString('utf8');
  }
};
