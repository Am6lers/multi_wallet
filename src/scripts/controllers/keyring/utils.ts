import { bufferToHex, toBuffer } from 'ethereumjs-util';
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

export const normalize = (input: number | string): string => {
  if (typeof input === 'number') {
    if (input < 0) {
      return '0x';
    }
    const buffer = toBuffer(input);
    input = bufferToHex(buffer);
  }

  if (typeof input !== 'string') {
    let msg = 'eth-sig-util.normalize() requires hex string or integer input.';
    msg += ` received ${typeof input}: ${input as any as string}`;
    throw new Error(msg);
  }

  return addHexPrefix(input.toLowerCase());
};
