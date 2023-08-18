import {
  SignTypedDataVersion,
  EthEncryptedData,
  TypedDataV1,
  TypedMessage as TypedMessageSig,
  MessageTypes,
} from '@metamask/eth-sig-util';

export type TypeSimpleKeyPair = 'Simple Key Pair';
export type TypeHdKeyTree = 'HD Key Tree';
export type BIP44Purpose = 44;
export type BIP84Purpose = 84;
export type BIPPurpose = BIP44Purpose | BIP84Purpose;

export interface PrivateKeys {
  evm: string | null;
  btc?: string | null;
}
export interface Addresses {
  evm: string | null;
  btc: string | null;
}

export interface DerivedAccountResult extends PrivateKeys {
  evm_address: string;
  btc_address: string;
  index: number;
}

export interface KeyringOpts {
  type: TypeSimpleKeyPair | TypeHdKeyTree;
  isTest?: boolean;
  privateKeys?: PrivateKeys;
  mnemonic?: string;
  seed?: string;
  // seed?: Buffer;
  masterId?: string;
  walletType?: string;
  numberOfDeriven?: number;
  numbersOfChildren?: number[];
  hdPath?: { [key: string]: HdPathOpts };
  id?: string | null;
}

export interface GetPrivateKeyOpts {
  version?: SignTypedDataVersion;
  withAppKeyOrigin?: string;
}

export interface HdPathOpts {
  purpose: BIPPurpose;
  coinType: number;
  account: number;
  change: number;
  addressIndex: number;
}

export interface BiportKeyringControllerOpts {
  initState: any;
  encryptor: any;
  isTest: boolean;
}

export interface DisplayKeyring {
  id: string | null;
  masterId: string | null;
  type: string;
  accounts: {
    [key: string]: string | null;
  };
  walletType: string;
  children?: string[];
  numberOfDeriven?: number;
  numbersOfChildren?: number[];
}

export interface OriginalRequest {
  origin?: string;
}

export interface AbstractMessage {
  id: string;
  time: number;
  status: string;
  type: string;
  rawSig?: string;
}

export interface AbstractMessageParams {
  from: string;
  origin?: string;
}

export interface AbstractMessageParamsMetamask extends AbstractMessageParams {
  metamaskId?: string;
}

export interface Message extends AbstractMessage {
  messageParams: MessageParams;
}

export interface MessageParams extends AbstractMessageParams {
  data: string;
}

export interface MessageParamsMetamask extends AbstractMessageParamsMetamask {
  data: string;
}

export interface PersonalMessage extends AbstractMessage {
  messageParams: PersonalMessageParams;
}

export interface PersonalMessageParams extends AbstractMessageParams {
  data: string;
}

export interface PersonalMessageParamsMetamask
  extends AbstractMessageParamsMetamask {
  data: string;
}

export interface TypedMessage extends AbstractMessage {
  error?: string;
  messageParams: TypedMessageParams;
  time: number;
  status: string;
  type: string;
  rawSig?: string;
}

export interface TypedMessageParams extends AbstractMessageParams {
  data: TypedDataV1 | TypedMessageSig<MessageTypes>;
}

export interface TypedMessageParamsMetamask
  extends AbstractMessageParamsMetamask {
  data: Record<string, unknown>[] | string;
  metamaskId?: string;
  error?: string;
  version?: string;
}

export interface SignMessageParams extends AbstractMessageParams {
  data: string;
}

export interface DecryptMessageParams extends AbstractMessageParams {
  data: EthEncryptedData;
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
