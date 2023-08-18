import { NATIVE_TOKEN_ADDRESS } from '../constants/asset';
import { Network, INTERNALLY_USED_BITCOIN_CHAIN_ID } from '@constants/network';
import { capitalizeString } from '@utils/general';

export type TOKEN_TYPE = 'EVM' | 'BTC';

export const enum BitcoinNetwork {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  REGTEST = 'regtest',
}

export interface Token {
  name?: string;
  symbol: string;
  image?: string;
  iconUrl?: string;
  decimals: number;
  isERC721?: boolean;
  isCustomToken?: boolean;
  hadBalance?: boolean;
  unlisted?: boolean;
}
export interface EthToken extends Token {
  address: string;
  chainId: string;
  isNative?: boolean;
  occurrences?: number;
  aggregators?: string[];
  isTest?: boolean;
}

export interface BtcToken extends EthToken {
  network: BitcoinNetwork;
}

export const BtcMainnetTokenInfo: BtcToken = {
  name: 'Bitcoin',
  chainId: INTERNALLY_USED_BITCOIN_CHAIN_ID,
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 8,
  symbol: 'BTC',
  isNative: true,
  image:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/240px-Bitcoin.png',
  iconUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/240px-Bitcoin.png',
  network: BitcoinNetwork.MAINNET,
};

export const BtcTestnetTokenInfo: BtcToken = {
  ...BtcMainnetTokenInfo,
  network: BitcoinNetwork.TESTNET,
};

export interface SearchEthToken extends EthToken {
  active?: boolean;
}

export interface NftBase {
  token_address: string; // The address of the NFT contract
  token_id: string | number; // The name of the NFT contract
  contract_type: string; // The type of NFT contract standard. ERC721 or ERC1155
  amount: string | number; // The number of this item the user owns
  name: string; // The name of the NFT contract
  symbol: string; // The symbol of the NFT contract
  metadata:
    | ({
        // The metadata of the NFT
        name: string; // The name or title of the NFT
        image: string; // The URL of the NFT's image
      } & { [key: string]: string | number })
    | null; // The matedata is Nullable
}

export const getBitcoinNetworkName = (network: BitcoinNetwork) =>
  `${BtcMainnetTokenInfo.name} ${capitalizeString(network.toString())}`;

export const getTokenType = (token: EthToken | BtcToken): TOKEN_TYPE => {
  const isBtc: boolean =
    token.name === BtcMainnetTokenInfo?.name &&
    token.symbol === BtcMainnetTokenInfo.symbol &&
    token.iconUrl === BtcMainnetTokenInfo.iconUrl &&
    token.decimals === BtcMainnetTokenInfo.decimals;

  return isBtc ? 'BTC' : 'EVM';
};

export const BITCOIN_MAINNET: Network = {
  key: 'bitcoin_mainnet',
  name: getBitcoinNetworkName(BitcoinNetwork.MAINNET),
  rpcTarget: '',
  chainId: BtcMainnetTokenInfo.chainId,
  networkId: '',
  ticker: BtcMainnetTokenInfo.symbol,
  logo: BtcMainnetTokenInfo.iconUrl!,
  coinType: 0,
  color: '#F7931A',
};
