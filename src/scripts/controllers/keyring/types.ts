import { SignTypedDataVersion } from '@metamask/controllers';

export type TypeSimpleKeyPair = 'Simple Key Pair';
export type TypeHdKeyTree = 'HD Key Tree';
export type BIP44Purpose = 44;
export type BIP84Purpose = 84;
export type BIPPurpose = BIP44Purpose | BIP84Purpose;

export const TYPE_SIMPLE_KEY_PAIR: TypeSimpleKeyPair = 'Simple Key Pair';
export const TYPE_HD_KEY_TREE: TypeHdKeyTree = 'HD Key Tree';
const BIP44_PURPOSE: BIP44Purpose = 44;
const BIP84_PURPOSE: BIP84Purpose = 84;

export interface PrivateKeys {
  evm: string | null;
  btc: string | null;
}
export interface Addresses {
  evm: string | null;
  btc: string | null;
}

export interface KeyringOpts {
  keyringType: TypeSimpleKeyPair | TypeHdKeyTree;
  id?: string;
  masterId?: string;
  numberOfDriven?: number;
  numbersOfChildren?: number[];
  privateKeys?: PrivateKeys;
  mnemonic?: string;
}

export interface GetPrivateKeyOpts {
  version?: SignTypedDataVersion;
  withAppKeyOrigin?: string;
}

export interface DisplayKeyring {
  id: string | null;
  masterId: string | null;
  type: string;
  accounts: {
    [key: string]: string | null;
  };
  children?: string[];
  numberOfDeriven?: number;
  numbersOfChildren?: number[];
}

export type AdditionalAccountStatus = 'NEW' | 'DUPLICATE';

export interface AdditionalAccountResult {
  addresses: Addresses;
  status: AdditionalAccountStatus;
}

export type UnlockErrorType =
  | 'NOT_MIGRATED'
  | 'WITHOUT_VAULT'
  | 'INVALID_KEYRING'
  | 'INVALID_HD_KEYRING'
  | 'INVALID_SIMPLE_KEYRING';

export const UnlockError: { [key: string]: UnlockErrorType } = {
  NOT_MIGRATED: 'NOT_MIGRATED',
  WITHOUT_VAULT: 'WITHOUT_VAULT',
  INVALID_KEYRING: 'INVALID_KEYRING',
  INVALID_HD_KEYRING: 'INVALID_HD_KEYRING',
  INVALID_SIMPLE_KEYRING: 'INVALID_SIMPLE_KEYRING',
};
