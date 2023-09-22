import BigNumber from 'bignumber.js';
import { NATIVE_TOKEN_ADDRESS } from '@constants/asset';

export interface CoingeckoBalanceData {
  [chainName: string]: { usd: number };
  // binancecoin: { usd: 219.01 },
  // ethereum: { usd: 1653.75 },
  // 'klay-token': { usd: 0.116917 }
}

export const convertCoingeckoToMoralis = (
  coingeckoData: CoingeckoBalanceData,
) => {
  return Object.entries(coingeckoData).map(([network, price]) => {
    const networkName = network.toLowerCase();
    if (networkName.includes('avalanche')) {
      return {
        tokenName: 'Avalanche',
        tokenSymbol: 'AVAX',
        tokenLogo: undefined,
        usdPrice: new BigNumber(price.usd),
        dayPercentChange: undefined,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        chainId: '0xa86a',
      };
    }
    if (networkName.includes('klay')) {
      return {
        tokenName: 'Klaytn',
        tokenSymbol: 'KLAY',
        tokenLogo: undefined,
        usdPrice: new BigNumber(price.usd),
        dayPercentChange: undefined,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        chainId: '0x2019',
      };
    }
    if (networkName.includes('ethereum')) {
      return {
        tokenName: 'Ethereum',
        tokenSymbol: 'ETH',
        tokenLogo: undefined,
        usdPrice: new BigNumber(price.usd),
        dayPercentChange: undefined,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        chainId: '0x1',
      };
    }
    if (networkName.includes('binance')) {
      return {
        tokenName: 'Binance',
        tokenSymbol: 'BNB',
        tokenLogo: undefined,
        usdPrice: new BigNumber(price.usd),
        dayPercentChange: undefined,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        chainId: '0x38',
      };
    }
    if (networkName.includes('matic')) {
      return {
        tokenName: 'Polygon',
        tokenSymbol: 'MATIC',
        tokenLogo: undefined,
        usdPrice: new BigNumber(price.usd),
        dayPercentChange: undefined,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        chainId: '0x89',
      };
    }
  });
};
