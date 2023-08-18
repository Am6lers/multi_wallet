import {
  BIFROST_MAINNET_EXPLORER_URL,
  BIFROST_TESTNET_EXPLORER_URL,
} from '../../constants/asset';

export const getBifrostExplorerUrl = (isTest?: boolean) =>
  isTest ? BIFROST_TESTNET_EXPLORER_URL : BIFROST_MAINNET_EXPLORER_URL;

export const getRouteBifrostTokenBalancesNft = (address: string) => {
  return `api/v2/addresses/${address}/token-balances-nft`;
};
