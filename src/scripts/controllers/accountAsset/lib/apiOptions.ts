export const config = {
  method: 'post',
  url: 'https://deep-index.moralis.io/api/v2.2/erc20/prices?chain=0x1&include=percent_change',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
  },
};

export const moralisApiUrl = (chainId: string) => {
  return `https://deep-index.moralis.io/api/v2.2/erc20/prices?chain=${chainId}&include=percent_change`;
};

const ids = 'ethereum,binancecoin,avalanche-2,klay-token,matic-network';
export const nativepriceAPi = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
