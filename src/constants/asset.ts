import {
  NETWORKS,
  AVAX,
  AVAXTEST,
  BNB_TOKEN_IMAGE_URL,
  BSC,
  BSCTEST,
  KLAYTN_BAOBAB,
  KLAYTN_CYPRESS,
  MAINNET,
  GOERLI,
  POLYGON,
  POLYGON_MUMBAI,
  BIFROST_TEST,
  BSC_CHAIN_ID,
  AVAX_CHAIN_ID,
  POLYGON_CHAIN_ID,
  KLAYTN_CYPRESS_CHAIN_ID,
  MAINNET_CHAIN_ID,
  INTERNALLY_USED_BITCOIN_CHAIN_ID,
  ETH_SYMBOL,
  ETH_TOKEN_IMAGE_URL,
  BNB_SYMBOL,
  AVAX_SYMBOL,
  AVAX_TOKEN_IMAGE_URL,
  MATIC_SYMBOL,
  MATIC_TOKEN_IMAGE_URL,
  KLAY_SYMBOL,
  KLAY_TOKEN_IMAGE_URL,
  BIFROST_SYMBOL,
  BIFROST_TOKEN_IMAGE_URL,
  BIFROST_TEST_CHAIN_ID,
  ETH_BIFROST_TOKEN_IMAGE_URL,
  ETH_BIFI_TOKEN_IMAGE_URL,
  BIFROST,
  BIFROST_CHAIN_ID,
  BSCTEST_CHAIN_ID,
  AVAX_TEST_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
  KLAYTN_BAOBAB_CHAIN_ID,
} from '@constants/network';
import { find } from 'lodash';

const getTokenInMeta = (
  meta: {
    address: string;
    name: string;
    symbol: string;
    iconUrl: string;
    decimals: number;
    chainId: string;
  }[],
  address: string,
) => {
  return find(meta, item => {
    return item.address.toLowerCase() === address.toLowerCase();
  });
};

export const NATIVE_TOKEN_ADDRESS =
  '0x0000000000000000000000000000000000000000';

export const BIFROST_BIFI_ADDRESS =
  '0x047938C3aD13c1eB821C8e310B2B6F889b6d0003';
export const BIFROST_BNB_ADDRESS = '0xB800EaF843F962DFe5e145A8c9D07A3e70b11d7F';
export const BIFROST_ETH_ADDRESS = '0x6c9944674C1D2cF6c4c4999FC7290Ba105dcd70e';
export const BIFROST_USDC_ADDRESS =
  '0x640952E7984f2ECedeAd8Fd97aA618Ab1210A21C';
export const BIFROST_MATIC_ADDRESS =
  '0x21ad243b81eff53482F6F6E7C76539f2CfC0B734';

export const ETH_BFC_ADDRESS = '0x0c7D5ae016f806603CB1782bEa29AC69471CAb9c';

export const MAINNET_ETH_USDC_ADDRESS =
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

export const MAINNET_ETH = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  image: ETH_TOKEN_IMAGE_URL,
  iconUrl: ETH_TOKEN_IMAGE_URL,
  symbol: ETH_SYMBOL,
  name: 'Ethereum',
  chainId: NETWORKS[MAINNET].chainId,
  isNative: true,
};
export const MAINNET_ETHEREUM_BIFI = {
  address: '0x2791BfD60D232150Bff86b39B7146c0eaAA2BA81',
  symbol: 'BIFI',
  decimals: 18,
  image: ETH_BIFI_TOKEN_IMAGE_URL,
  iconUrl: ETH_BIFI_TOKEN_IMAGE_URL,
  name: 'BiFi',
  chainId: NETWORKS[MAINNET].chainId,
};

export const MAINNET_ETHEREUM_BFC = {
  address: '0x0c7D5ae016f806603CB1782bEa29AC69471CAb9c',
  symbol: 'BFC',
  decimals: 18,
  image: ETH_BIFROST_TOKEN_IMAGE_URL,
  iconUrl: ETH_BIFROST_TOKEN_IMAGE_URL,
  name: 'Bifrost',
  chainId: NETWORKS[MAINNET].chainId,
};

export const MAINNET_BNB = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  image: BNB_TOKEN_IMAGE_URL,
  iconUrl: BNB_TOKEN_IMAGE_URL,
  symbol: BNB_SYMBOL,
  name: 'Binance Coin',
  chainId: NETWORKS[BSC].chainId,
};
export const MAINNET_AVAX = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  image: AVAX_TOKEN_IMAGE_URL,
  iconUrl: AVAX_TOKEN_IMAGE_URL,
  symbol: AVAX_SYMBOL,
  name: 'Avalanche',
  chainId: NETWORKS[AVAX].chainId,
};
export const MAINNET_KLAY = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  image: KLAY_TOKEN_IMAGE_URL,
  iconUrl: KLAY_TOKEN_IMAGE_URL,
  symbol: KLAY_SYMBOL,
  name: 'Klaytn',
  chainId: NETWORKS[KLAYTN_CYPRESS].chainId,
};
export const MAINNET_MATIC = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  image: MATIC_TOKEN_IMAGE_URL,
  iconUrl: MATIC_TOKEN_IMAGE_URL,
  symbol: MATIC_SYMBOL,
  name: 'Polygon',
  chainId: NETWORKS[POLYGON].chainId,
};
export const MAINNET_BFC = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  image: BIFROST_TOKEN_IMAGE_URL,
  iconUrl: BIFROST_TOKEN_IMAGE_URL,
  symbol: BIFROST_SYMBOL,
  name: 'Bifrost',
  chainId: NETWORKS[BIFROST].chainId,
};

export const TESTNET_GOERLI_ETH = {
  ...MAINNET_ETH,
  chainId: NETWORKS[GOERLI].chainId,
};
export const TESTNET_BNB = {
  ...MAINNET_BNB,
  chainId: NETWORKS[BSCTEST].chainId,
};
export const TESTNET_AVAX = {
  ...MAINNET_AVAX,
  chainId: NETWORKS[AVAXTEST].chainId,
};
export const TESTNET_KLAY = {
  ...MAINNET_KLAY,
  chainId: NETWORKS[KLAYTN_BAOBAB].chainId,
};
export const TESTNET_MATIC = {
  ...MAINNET_MATIC,
  chainId: NETWORKS[POLYGON_MUMBAI].chainId,
};
export const TESTNET_BIFROST = {
  ...MAINNET_BFC,
  chainId: NETWORKS[BIFROST_TEST].chainId,
};

export const MAINNETWORK_NATIVE_TOKENS = [
  MAINNET_ETH,
  MAINNET_BNB,
  MAINNET_AVAX,
  MAINNET_KLAY,
  MAINNET_MATIC,
  MAINNET_BFC,
];

export const TEST_NETWORKS_DEFAULT_TOKEN = [
  TESTNET_GOERLI_ETH,
  TESTNET_BNB,
  TESTNET_AVAX,
  TESTNET_KLAY,
  TESTNET_MATIC,
  TESTNET_BIFROST,
];
export const MAIN_NETWORKS_DEFAULT_TOKEN = [
  ...MAINNETWORK_NATIVE_TOKENS,
  // MAINNET_ETHEREUM_BIFI,
  // MAINNET_ETHEREUM_BFC,
];

export const DEFAULT_TOKEN = MAIN_NETWORKS_DEFAULT_TOKEN.concat(
  TEST_NETWORKS_DEFAULT_TOKEN,
);

export const USDT_SYMBOL = 'USDT';
export const DAI_SYMBOL = 'DAI';
export const LINK_SYMBOL = 'LINK';
export const USDC_SYMBOL = 'USDC';
export const WBTC_SYMBOL = 'WBTC';
export const BIBTC_SYMBOL = 'BIBTC';

export const defaultInvisibleCoin: { [key: string]: boolean } = {
  [BIFROST_CHAIN_ID]: false,
  [BIFROST_TEST_CHAIN_ID]: false,
  [INTERNALLY_USED_BITCOIN_CHAIN_ID]: false,
  [MAINNET_CHAIN_ID]: false,
  [BSC_CHAIN_ID]: false,
  [BSCTEST_CHAIN_ID]: false,
  [AVAX_CHAIN_ID]: false,
  [AVAX_TEST_CHAIN_ID]: false,
  [POLYGON_CHAIN_ID]: false,
  [POLYGON_MUMBAI_CHAIN_ID]: false,
  [KLAYTN_CYPRESS_CHAIN_ID]: false,
  [KLAYTN_BAOBAB_CHAIN_ID]: false,
};

export const daiLogoExceptions = [
  new RegExp('ethereum(.*)0x6B175474E89094C44Da98b954EedeAC495271d0F', 'g'),
  new RegExp('polygon(.*)0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 'g'),
  new RegExp('avalanche(.*)0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 'g'),
];

export const GWEI_DECIMAL_POINT = 9;

export const CoinMetadata = {
  [MAINNET_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    symbol: ETH_SYMBOL,
    // name: ETH_SYMBOL,
    name: MAINNET_ETH.name,
    decimals: 18,
    chainId: MAINNET_CHAIN_ID,
    iconUrl: ETH_TOKEN_IMAGE_URL,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
  [BSC_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    symbol: BNB_SYMBOL,
    // name: BNB_SYMBOL,
    name: MAINNET_BNB.name,
    decimals: 18,
    chainId: BSC_CHAIN_ID,
    iconUrl: BNB_TOKEN_IMAGE_URL,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
  [AVAX_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    symbol: AVAX_SYMBOL,
    // name: AVAX_SYMBOL,
    name: MAINNET_AVAX.name,
    decimals: 18,
    chainId: AVAX_CHAIN_ID,
    iconUrl: AVAX_TOKEN_IMAGE_URL,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
  [POLYGON_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    symbol: MATIC_SYMBOL,
    // name: MATIC_SYMBOL,
    name: MAINNET_MATIC.name,
    decimals: 18,
    chainId: POLYGON_CHAIN_ID,
    iconUrl: MATIC_TOKEN_IMAGE_URL,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
  [KLAYTN_CYPRESS_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    // name: KLAY_SYMBOL,
    name: MAINNET_KLAY.name,
    symbol: KLAY_SYMBOL,
    iconUrl: KLAY_TOKEN_IMAGE_URL,
    decimals: 18,
    chainId: KLAYTN_CYPRESS_CHAIN_ID,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
  [BIFROST_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    // name: BIFROST_SYMBOL,
    name: MAINNET_BFC.name,
    symbol: BIFROST_SYMBOL,
    iconUrl: BIFROST_TOKEN_IMAGE_URL,
    decimals: 18,
    chainId: BIFROST_CHAIN_ID,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
  [BIFROST_TEST_CHAIN_ID]: {
    address: NATIVE_TOKEN_ADDRESS,
    // name: BIFROST_SYMBOL,
    name: MAINNET_BFC.name,
    symbol: BIFROST_SYMBOL,
    iconUrl: BIFROST_TOKEN_IMAGE_URL,
    decimals: 18,
    chainId: BIFROST_TEST_CHAIN_ID,
    isNative: true,
    isEnabled: false,
    isERC721: false,
  },
};

export const BIHOLDER_BASE_URL: string = __DEV__
  ? 'https://biholder-view.dev.thebifrost.io/'
  : 'https://biholder-view.thebifrost.io/';

export const BIFROST_MAINNET_EXPLORER_URL: string =
  'https://v2-explorer.mainnet.thebifrost.io/';
export const BIFROST_TESTNET_EXPLORER_URL: string =
  'https://v2-explorer.testnet.thebifrost.io/';

export const TEMPORARY_DEFAULT_NFT_IMAGES = [
  'https://i.ibb.co/nwrKTp8/default-Image1.png',
  'https://i.ibb.co/Xsr8BZK/default-Image2.png',
  'https://i.ibb.co/MsqpSLr/default-Image3.png',
  'https://i.ibb.co/3cwBZNF/default-Image4.png',
  'https://i.ibb.co/6njxyq7/default-Image5.png',
  'https://i.ibb.co/kxWJVzN/default-Image6.png',
  'https://i.ibb.co/j8dHzp1/default-Image7.png',
  'https://i.ibb.co/qJ9YT7H/default-Image8.png',
];

// export const TEMPORARY_DEFAULT_NFT_IMAGES = [
//   require('../assets/images/defaultProfile/default-Image1.png'),
//   require('../assets/images/defaultProfile/default-Image2.png'),
//   require('../assets/images/defaultProfile/default-Image3.png'),
//   require('../assets/images/defaultProfile/default-Image4.png'),
//   require('../assets/images/defaultProfile/default-Image5.png'),
//   require('../assets/images/defaultProfile/default-Image6.png'),
//   require('../assets/images/defaultProfile/default-Image7.png'),
//   require('../assets/images/defaultProfile/default-Image8.png')
// ];
