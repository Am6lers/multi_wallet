import { INFURA_PROJECT_ID } from '@env';

export interface Network {
  key: string;
  name: string;
  rpcTarget: string;
  chainId: string;
  networkId?: string;
  ticker: string;
  logo: string;
  coinType: number;
  color: string;
  isTest?: boolean;
}

//types
export type mainnetChainId = '0x1';
export type ropstenChainId = '0x3';
export type rinkebyChainId = '0x4';
export type goerliChainId = '0x5';
export type kovanChainId = '0x2a';
export type bscChainId = '0x38';
export type bscTestChainId = '0x61';
export type optimismChainId = '0xa';
export type optimismTestChainId = '0x45';
export type avaxChainId = '0xa86a';
export type avaxTestChainId = '0xa869';
export type klaytnChainId = '0x2019';
export type klaytnTestChainId = '0x3e9';
export type polygonChainId = '0x89';
export type polygonTestChainId = '0x13881';
export type bifrostChainId = '0xbfc';
export type bifrostTestChainId = '0xbfc0';
export type skaleChainId = '0x50877ed6';

// Keys
export const ROPSTEN = 'ropsten';
export const RINKEBY = 'rinkeby';
export const KOVAN = 'kovan';
export const MAINNET = 'mainnet';
export const GOERLI = 'goerli';
export const NETWORK_TYPE_RPC = 'rpc';
export const BSC = 'bsc';
export const BSCTEST = 'bsctest';
export const PILABTEST = 'pilabtest';
export const AVAX = 'avalanche-mainnet';
export const AVAXTEST = 'avalanche-testnet';
export const KLAYTN_CYPRESS = 'cypress';
export const KLAYTN_BAOBAB = 'baobab';
export const POLYGON = 'polygon-mainnet';
export const POLYGON_MUMBAI = 'polygon-mumbai';
export const BIFROST = 'bifrost';
export const BIFROST_TEST = 'bifrosttest1';
export const SKALE = 'skale';

export const MAINNET_NETWORK_ID = '1';
export const ROPSTEN_NETWORK_ID = '3';
export const RINKEBY_NETWORK_ID = '4';
export const GOERLI_NETWORK_ID = '5';
export const KOVAN_NETWORK_ID = '42';
export const BSC_NETWORK_ID = '56';
export const BSCTEST_NETWORK_ID = '97';
export const LOCALHOST_NETWORK_ID = '1337';
export const PILAB_TEST_NETWORK_ID = '2000';
export const AVAX_NETWORK_ID = '43114';
export const AVAX_TEST_NETWORK_ID = '43113';
export const KLAYTN_CYPRESS_NETWORK_ID = '8217';
export const KLAYTN_BAOBAB_NETWORK_ID = '1001';
export const POLYGON_NETWORK_ID = '137';
export const POLYGON_MUMBAI_NETWORK_ID = '80001';
export const BIFROST_NETWORK_ID = '3068';
export const BIFROST_TEST_NETWORK_ID = '49088';
export const SKALE_NETWORK_ID = '1351057110';

// internal bitcoin chain id
export const INTERNALLY_USED_BITCOIN_CHAIN_ID = '0x0';

export const MAINNET_CHAIN_ID: mainnetChainId = '0x1';
export const ROPSTEN_CHAIN_ID: ropstenChainId = '0x3';
export const RINKEBY_CHAIN_ID: rinkebyChainId = '0x4';
export const GOERLI_CHAIN_ID: goerliChainId = '0x5';
export const KOVAN_CHAIN_ID: kovanChainId = '0x2a';
export const LOCALHOST_CHAIN_ID = '0x539';
export const BSC_CHAIN_ID: bscChainId = '0x38';
export const BSCTEST_CHAIN_ID: bscTestChainId = '0x61';
export const OPTIMISM_CHAIN_ID: optimismChainId = '0xa';
export const OPTIMISM_TESTNET_CHAIN_ID: optimismTestChainId = '0x45';
export const PILAB_TEST_CHAIN_ID = '0x7d0';
export const AVAX_CHAIN_ID: avaxChainId = '0xa86a';
export const AVAX_TEST_CHAIN_ID: avaxTestChainId = '0xa869';
export const KLAYTN_CYPRESS_CHAIN_ID: klaytnChainId = '0x2019';
export const KLAYTN_BAOBAB_CHAIN_ID: klaytnTestChainId = '0x3e9';
export const POLYGON_CHAIN_ID: polygonChainId = '0x89';
export const POLYGON_MUMBAI_CHAIN_ID: polygonTestChainId = '0x13881';
export const BIFROST_CHAIN_ID: bifrostChainId = '0xbfc';
export const BIFROST_TEST_CHAIN_ID: bifrostTestChainId = '0xbfc0';
export const SKALE_CHAIN_ID: skaleChainId = '0x50877ed6';

export type ChainId =
  | mainnetChainId
  | ropstenChainId
  | rinkebyChainId
  | goerliChainId
  | kovanChainId
  | bscChainId
  | bscTestChainId
  | optimismChainId
  | optimismTestChainId
  | avaxChainId
  | avaxTestChainId
  | klaytnChainId
  | klaytnTestChainId
  | polygonChainId
  | polygonTestChainId
  | bifrostChainId
  | bifrostTestChainId
  | skaleChainId;

/**
 * The largest possible chain ID we can handle.
 * Explanation: https://gist.github.com/rekmarks/a47bd5f2525936c4b8eee31a16345553
 */
export const MAX_SAFE_CHAIN_ID = 4503599627370476;

export const ROPSTEN_DISPLAY_NAME = 'Ethereum Ropsten';
export const RINKEBY_DISPLAY_NAME = 'Ethereum Rinkeby';
export const KOVAN_DISPLAY_NAME = 'Ethereum Kovan';
export const MAINNET_DISPLAY_NAME = 'Ethereum network';
export const GOERLI_DISPLAY_NAME = 'Ethereum Goerli';
export const BSC_DISPLAY_NAME = 'Binance network';
export const BSC_TEST_DISPLAY_NAME = 'BNB Chain Test';
export const PILAB_TEST_DISPLAY_NAME = 'Pilab Test';
export const AVAX_DISPLAY_NAME = 'Avalanche network';
export const AVAX_TEST_DISPLAY_NAME = 'Avalanche Fuji Test';
export const KLAYTN_CYPRESS_DISPLAY_NAME = 'Klaytn network';
export const KLAYTN_BAOBAB_DISPLAY_NAME = 'Klaytn Baobab';
export const POLYGON_DISPLAY_NAME = 'Polygon network';
export const POLYGON_MUMBAI_DISPLAY_NAME = 'Polygon Mumbai Test';
export const BIFROST_DISPLAY_NAME = 'Bifrost network';
export const BIFROST_TEST_DISPLAY_NAME = 'Bifrost Testnet';
export const SKALE_DISPLAY_NAME = 'Skale network';

// mainnet image urls
export const NetworkImages = {
  ethereum:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/ethereum/image.png',
  binance:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/binance/image.png',
  avax: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/avalanche/image.png',
  klaytn:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/klaytn/image.png',
  polygon:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/polygon/image.png',
  bifrost:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/bifrost/image.png',
  skale:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/bifrost/image.png',
};

export const NetworkImageArray = Object.values(NetworkImages);

// testnet image urls
export const TestNetworkImages = {
  baobab:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/baobab/image.png',
  bianaceTest:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/bsctest/image.png',
  fuji: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/fuji/image.png',
  goerli:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/goerli/image.png',
  mumbai:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/mumbai/image.png',
  bifrostTest:
    'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Networks/bifrosttest1/image.png',
};
export function isSafeChainId(chainId: number) {
  return (
    Number.isSafeInteger(chainId) && chainId > 0 && chainId <= MAX_SAFE_CHAIN_ID
  );
}

export function isPrefixedFormattedHexString(value: any) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^0x[1-9a-f]+[0-9a-f]*$/iu.test(value);
}

export function distributedUrlByRandomCondition(urls: string[]) {
  try {
    if (urls.length === 0) {
      throw new Error('distributedUrlByRandomCondition: Empty url list');
    }
    //@ts-ignore
    const randomNum = parseInt(Math.random() * 100);
    const remain = randomNum % urls.length;
    return urls[remain];
  } catch (e) {
    return '';
  }
}

/**
 * @param {string} chainId - The chain ID to check for custom network.
 * @returns {boolean} Whether the given chain ID is custom network.
 */
export function isCustomNetwork(chainId: string) {
  return (
    chainId !== MAINNET_CHAIN_ID &&
    chainId !== GOERLI_CHAIN_ID &&
    chainId !== LOCALHOST_CHAIN_ID
  );
}

export const Icons = (chainId: string, address: string) => {
  let network = 'ethereum';
  if (chainId === INTERNALLY_USED_BITCOIN_CHAIN_ID) {
    network = 'ethereum';
  } else if (
    chainId === MAINNET_CHAIN_ID ||
    chainId === KOVAN_CHAIN_ID ||
    chainId === ROPSTEN_CHAIN_ID ||
    chainId === GOERLI_CHAIN_ID
  ) {
    network = 'ethereum';
  } else if (chainId === BSC_CHAIN_ID || chainId === BSCTEST_CHAIN_ID) {
    network = 'binance';
  } else if (chainId === AVAX_CHAIN_ID || chainId === AVAX_TEST_CHAIN_ID) {
    network = 'avalanche';
  } else if (
    chainId === POLYGON_CHAIN_ID ||
    chainId === POLYGON_MUMBAI_CHAIN_ID
  ) {
    network = 'polygon';
  } else if (
    chainId === KLAYTN_CYPRESS_CHAIN_ID ||
    chainId === KLAYTN_BAOBAB_CHAIN_ID
  ) {
    network = 'klaytn';
  } else if (chainId === BIFROST_CHAIN_ID) {
    network = 'bifrost';
  } else if (chainId === BIFROST_TEST_CHAIN_ID) {
    network = 'bifrosttest1';
  } else if (chainId === SKALE_CHAIN_ID) {
    network = 'skale';
  }
  return `https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/${network}/tokens/images/128/${address}.png`;
};

export function blockTagParamIndex(payload: any) {
  switch (payload.method) {
    // blockTag is at index 2
    case 'eth_getStorageAt':
      return 2;
    // blockTag is at index 1
    case 'eth_getBalance':
    case 'eth_getCode':
    case 'eth_getTransactionCount':
    case 'eth_call':
      return 1;
    // blockTag is at index 0
    case 'eth_getBlockByNumber':
      return 0;
    // there is no blockTag
    default:
      return undefined;
  }
}

export const getNativeCoinIcons = (chainId: string) => {
  let network = 'ethereum';
  if (chainId === INTERNALLY_USED_BITCOIN_CHAIN_ID) {
    network = 'ethereum';
  } else if (
    chainId === MAINNET_CHAIN_ID ||
    chainId === KOVAN_CHAIN_ID ||
    chainId === ROPSTEN_CHAIN_ID ||
    chainId === GOERLI_CHAIN_ID
  ) {
    network = 'ethereum';
  } else if (chainId === BSC_CHAIN_ID || chainId === BSCTEST_CHAIN_ID) {
    network = 'binance';
  } else if (chainId === AVAX_CHAIN_ID || chainId === AVAX_TEST_CHAIN_ID) {
    network = 'avalanche';
  } else if (
    chainId === POLYGON_CHAIN_ID ||
    chainId === POLYGON_MUMBAI_CHAIN_ID
  ) {
    network = 'polygon';
  } else if (
    chainId === KLAYTN_CYPRESS_CHAIN_ID ||
    chainId === KLAYTN_BAOBAB_CHAIN_ID
  ) {
    network = 'klaytn';
  } else if (chainId === BIFROST_CHAIN_ID) {
    network = 'bifrost';
  } else if (chainId === BIFROST_TEST_CHAIN_ID) {
    network = 'bifrosttest1';
  }

  return `https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/${network}/coin/coinImage.png`;
};

export const getNetworkImage = (chainId: string) => {
  if (chainId === INTERNALLY_USED_BITCOIN_CHAIN_ID) {
    return 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg';
  }
  if (
    chainId === MAINNET_CHAIN_ID ||
    chainId === GOERLI_CHAIN_ID ||
    chainId === KOVAN_CHAIN_ID ||
    chainId === ROPSTEN_CHAIN_ID
  ) {
    return NetworkImages.ethereum;
  }
  if (chainId === BSC_CHAIN_ID) {
    return NetworkImages.binance;
  }
  if (chainId === BSCTEST_CHAIN_ID) {
    return TestNetworkImages.bianaceTest;
  }
  if (chainId === AVAX_CHAIN_ID) {
    return NetworkImages.avax;
  }
  if (chainId === AVAX_TEST_CHAIN_ID) {
    return TestNetworkImages.fuji;
  }
  if (chainId === POLYGON_CHAIN_ID) {
    return NetworkImages.polygon;
  }
  if (chainId === POLYGON_MUMBAI_CHAIN_ID) {
    return TestNetworkImages.mumbai;
  }
  if (chainId === KLAYTN_CYPRESS_CHAIN_ID) {
    return NetworkImages.klaytn;
  }
  if (chainId === KLAYTN_BAOBAB_CHAIN_ID) {
    return TestNetworkImages.baobab;
  }
  if (chainId === BIFROST_CHAIN_ID) {
    return NetworkImages.bifrost;
  }
  if (chainId === BIFROST_TEST_CHAIN_ID) {
    return TestNetworkImages.bianaceTest;
  }
};

export const getRpcUrl = (network: string) => {
  let url = '';
  if (BSC === network) {
    url = 'https://bsc-dataseed.binance.org/';
  } else if (BSCTEST === network) {
    url = 'https://data-seed-prebsc-2-s1.binance.org:8545/';
  } else if (AVAX === network) {
    url = 'https://api.avax.network/ext/bc/C/rpc';
  } else if (AVAXTEST === network) {
    url = 'https://api.avax-test.network/ext/bc/C/rpc';
  } else if (KLAYTN_CYPRESS === network) {
    // url = 'https://cypress.chain.thebifrost.io';
    url = 'https://1rpc.io/klay';
  } else if (KLAYTN_BAOBAB === network) {
    url = 'https://1rpc.io/klay';
    // url = 'https://api.baobab.klaytn.net:8651';
  }
  // else if (BIFROST === network) {
  //   url = distributedUrlByRandomCondition([
  //     'https://public-01.mainnet.thebifrost.io/rpc',
  //     'https://public-02.mainnet.thebifrost.io/rpc',
  //   ]);
  // } else if (BIFROST_TEST === network) {
  //   url = distributedUrlByRandomCondition([
  //     'https://public-01.testnet.thebifrost.io/rpc',
  //     'https://public-02.testnet.thebifrost.io/rpc',
  //   ]);
  // }
  else if (POLYGON === network) {
    url = 'https://polygon.llamarpc.com';
  } else if (GOERLI === network) {
    url = 'https://ethereum-goerli.publicnode.com';
  } else if (SKALE === network) {
    url = 'https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix';
  } else {
    // url = `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
    url = 'https://eth.llamarpc.com';
  }
  return url;
};

export const getWsUrl = (network: string) => {
  let url = '';
  if (MAINNET === network || GOERLI === network) {
    url = `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
  } else if (AVAX === network) {
    url = 'wss://api.avax.network/ext/bc/C/ws';
  } else if (AVAXTEST === network) {
    url = 'wss://api.avax-test.network/ext/bc/C/ws';
  } else if (KLAYTN_CYPRESS === network) {
    url = 'wss://public-node-api.klaytnapi.com/v1/cypress/ws';
  } else if (KLAYTN_BAOBAB === network) {
    url = 'wss://public-node-api.klaytnapi.com/v1/baobab/ws';
  } else if (SKALE === network) {
    url = 'wss://staging-v3.skalenodes.com/v1/ws/staging-fast-active-bellatrix';
  }
  // TODO: bifrost, BSC node 확인
  return url;
};

export const ROPSTEN_RPC_URL = getRpcUrl(ROPSTEN);
export const RINKEBY_RPC_URL = getRpcUrl(RINKEBY);
export const KOVAN_RPC_URL = getRpcUrl(KOVAN);
export const MAINNET_RPC_URL = getRpcUrl(MAINNET);
export const GOERLI_RPC_URL = getRpcUrl(GOERLI);
export const BSC_RPC_URL = getRpcUrl(BSC);
export const BSC_TEST_RPC_URL = getRpcUrl(BSCTEST);
export const PILAB_TEST_RPC_URL = getRpcUrl(PILABTEST);
export const AVAX_RPC_URL = getRpcUrl(AVAX);
export const AVAX_TEST_RPC_URL = getRpcUrl(AVAXTEST);
export const KLAYTN_CYPRESS_RPC_URL = getRpcUrl(KLAYTN_CYPRESS);
export const KLAYTN_BAOBAB_RPC_URL = getRpcUrl(KLAYTN_BAOBAB);
export const POLYGON_RPC_URL = getRpcUrl(POLYGON);
export const POLYGON_MUMBAI_RPC_URL = getRpcUrl(POLYGON_MUMBAI);
export const BIFROST_RPC_URL = getRpcUrl(BIFROST);
export const BIFROST_TEST_RPC_URL = getRpcUrl(BIFROST_TEST);
export const SKALE_RPC_URL = getRpcUrl(SKALE);

export const MAINNET_WS_URL = getWsUrl(MAINNET);
export const GOERLI_WS_URL = getWsUrl(GOERLI);
export const AVAX_WS_URL = getWsUrl(AVAX);
export const AVAX_TEST_WS_URL = getWsUrl(AVAXTEST);
export const KLAYTN_CYPRESS_WS_URL = getWsUrl(KLAYTN_CYPRESS);
export const KLAYTN_BAOBAB_WS_URL = getWsUrl(KLAYTN_BAOBAB);
export const SKALE_WS_URL = getWsUrl(SKALE);

export const ETH_SYMBOL = 'ETH';
export const WETH_SYMBOL = 'WETH';
export const TEST_ETH_SYMBOL = 'TESTETH';
export const BNB_SYMBOL = 'BNB';
export const MATIC_SYMBOL = 'MATIC';
export const AVAX_SYMBOL = 'AVAX';
export const KLAY_SYMBOL = 'KLAY';
export const BIFROST_SYMBOL = 'BFC';
export const SKALE_SYMBOL = 'SKL';

export const ETH_TOKEN_IMAGE_URL = getNativeCoinIcons(MAINNET_CHAIN_ID);
export const TEST_ETH_TOKEN_IMAGE_URL = getNativeCoinIcons(ROPSTEN_CHAIN_ID);
export const BNB_TOKEN_IMAGE_URL = getNativeCoinIcons(BSC_CHAIN_ID);
export const MATIC_TOKEN_IMAGE_URL = getNativeCoinIcons(POLYGON_CHAIN_ID);
export const AVAX_TOKEN_IMAGE_URL = getNativeCoinIcons(AVAX_CHAIN_ID);
export const KLAY_TOKEN_IMAGE_URL = getNativeCoinIcons(KLAYTN_CYPRESS_CHAIN_ID);
export const BIFROST_TOKEN_IMAGE_URL = getNativeCoinIcons(BIFROST_CHAIN_ID);
export const ETH_BIFROST_TOKEN_IMAGE_URL =
  'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/ethereum/tokens/images/128/0x0c7D5ae016f806603CB1782bEa29AC69471CAb9c.png';
export const ETH_BIFI_TOKEN_IMAGE_URL =
  'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/ethereum/tokens/images/128/0x2791BfD60D232150Bff86b39B7146c0eaAA2BA81.png';

export const INFURA_PROVIDER_TYPES = [ROPSTEN, RINKEBY, KOVAN, MAINNET, GOERLI];

// available: mainnet, goerli, avax, avax test
export const WS_URLS: { [key: string]: string } = {
  // [MAINNET_CHAIN_ID]: MAINNET_WS_URL,
  // [GOERLI_CHAIN_ID]: GOERLI_WS_URL,
  // [AVAX_CHAIN_ID]: AVAX_WS_URL,
  // [AVAX_TEST_CHAIN_ID]: AVAX_TEST_WS_URL,
  // [KLAYTN_CYPRESS_CHAIN_ID]: KLAYTN_CYPRESS_WS_URL,
  // [KLAYTN_BAOBAB_CHAIN_ID]: KLAYTN_BAOBAB_WS_URL,
};

export const TEST_CHAINS = [
  ROPSTEN_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  GOERLI_CHAIN_ID,
  KOVAN_CHAIN_ID,
  BSCTEST_CHAIN_ID,
  AVAX_TEST_CHAIN_ID,
  KLAYTN_BAOBAB_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
  BIFROST_TEST_CHAIN_ID,
];

export const INFURA_BLOCKED_KEY = 'countryBlocked';

export const ETH_INFURA_PROVIDER_CHAIN_ID = [
  ROPSTEN_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  KOVAN_CHAIN_ID,
  MAINNET_CHAIN_ID,
  GOERLI_CHAIN_ID,
];

/**
 * Hardforks are points in the chain where logic is changed significantly
 * enough where there is a fork and the new fork becomes the active chain.
 * These constants are presented in chronological order starting with BERLIN
 * because when we first needed to track the hardfork we had launched support
 * for EIP-2718 (where transactions can have types and different shapes) and
 * EIP-2930 (optional access lists), which were included in BERLIN.
 *
 * BERLIN - forked at block number 12,244,000, included typed transactions and
 *  optional access lists
 * LONDON - future, upcoming fork that introduces the baseFeePerGas, an amount
 *  of the ETH transaction fees that will be burned instead of given to the
 *  miner. This change necessitated the third type of transaction envelope to
 *  specify maxFeePerGas and maxPriorityFeePerGas moving the fee bidding system
 *  to a second price auction model.
 */
export const HARDFORKS = {
  BERLIN: 'berlin',
  LONDON: 'london',
};

export const CHAIN_ID_TO_GAS_LIMIT_BUFFER_MAP = {
  [OPTIMISM_CHAIN_ID]: 1,
  [OPTIMISM_TESTNET_CHAIN_ID]: 1,
};

export const MAIN_NETWORKS_MAP: { [key: string]: Network } = {
  [BIFROST]: {
    key: BIFROST,
    name: BIFROST_DISPLAY_NAME,
    rpcTarget: BIFROST_RPC_URL,
    chainId: BIFROST_CHAIN_ID,
    networkId: BIFROST_NETWORK_ID,
    ticker: BIFROST_SYMBOL,
    logo: NetworkImages.bifrost,
    coinType: 60,
    color: '#01C7FF',
  },
  [MAINNET]: {
    key: MAINNET,
    name: MAINNET_DISPLAY_NAME,
    rpcTarget: MAINNET_RPC_URL,
    chainId: MAINNET_CHAIN_ID,
    networkId: MAINNET_NETWORK_ID,
    ticker: ETH_SYMBOL,
    logo: NetworkImages.ethereum,
    coinType: 60,
    color: '#47b4a4',
  },
  [BSC]: {
    key: BSC,
    name: BSC_DISPLAY_NAME,
    rpcTarget: BSC_RPC_URL,
    chainId: BSC_CHAIN_ID,
    networkId: String(Number(BSC_CHAIN_ID)),
    ticker: BNB_SYMBOL,
    logo: NetworkImages.binance,
    // coinType: 714,
    coinType: 60,
    color: '#f3ba2f',
  },
  [AVAX]: {
    key: AVAX,
    name: AVAX_DISPLAY_NAME,
    rpcTarget: AVAX_RPC_URL,
    chainId: AVAX_CHAIN_ID,
    networkId: AVAX_NETWORK_ID,
    ticker: AVAX_SYMBOL,
    logo: NetworkImages.avax,
    coinType: 60,
    color: '#E84142',
  },
  [KLAYTN_CYPRESS]: {
    key: KLAYTN_CYPRESS,
    name: KLAYTN_CYPRESS_DISPLAY_NAME,
    rpcTarget: KLAYTN_CYPRESS_RPC_URL,
    chainId: KLAYTN_CYPRESS_CHAIN_ID,
    networkId: KLAYTN_CYPRESS_NETWORK_ID,
    ticker: KLAY_SYMBOL,
    logo: NetworkImages.klaytn,
    coinType: 60,
    color: '#897DBC',
  },
  [POLYGON]: {
    key: POLYGON,
    name: POLYGON_DISPLAY_NAME,
    rpcTarget: POLYGON_RPC_URL,
    chainId: POLYGON_CHAIN_ID,
    networkId: POLYGON_NETWORK_ID,
    ticker: MATIC_SYMBOL,
    logo: NetworkImages.polygon,
    coinType: 60,
    color: '#8247E5',
  },
  [SKALE]: {
    key: SKALE,
    name: SKALE_DISPLAY_NAME,
    rpcTarget: SKALE_RPC_URL,
    chainId: SKALE_CHAIN_ID,
    networkId: SKALE_NETWORK_ID,
    ticker: SKALE_SYMBOL,
    logo: NetworkImages.polygon,
    coinType: 60,
    color: 'black',
  },
};

export const TEST_NETWORKS_MAP: { [key: string]: Network } = {
  [GOERLI]: {
    key: GOERLI,
    name: GOERLI_DISPLAY_NAME,
    rpcTarget: GOERLI_RPC_URL,
    chainId: GOERLI_CHAIN_ID,
    networkId: GOERLI_NETWORK_ID,
    ticker: ETH_SYMBOL,
    logo: NetworkImages.ethereum,
    // coinType: 1,
    coinType: 60,
    color: '#5C5C5C',
    isTest: true,
  },
  [BSCTEST]: {
    key: BSCTEST,
    name: BSC_TEST_DISPLAY_NAME,
    rpcTarget: BSC_TEST_RPC_URL,
    chainId: BSCTEST_CHAIN_ID,
    networkId: BSCTEST_NETWORK_ID,
    ticker: BNB_SYMBOL,
    logo: TestNetworkImages.bianaceTest,
    // coinType: 1,
    coinType: 60,
    color: '#5C5C5C',
    isTest: true,
  },
  [AVAXTEST]: {
    key: AVAXTEST,
    name: AVAX_TEST_DISPLAY_NAME,
    rpcTarget: AVAX_TEST_RPC_URL,
    chainId: AVAX_TEST_CHAIN_ID,
    networkId: AVAX_TEST_NETWORK_ID,
    ticker: AVAX_SYMBOL,
    logo: TestNetworkImages.fuji,
    coinType: 60,
    color: '#5C5C5C',
    isTest: true,
  },
  [KLAYTN_BAOBAB]: {
    key: KLAYTN_BAOBAB,
    name: KLAYTN_BAOBAB_DISPLAY_NAME,
    rpcTarget: KLAYTN_BAOBAB_RPC_URL,
    chainId: KLAYTN_BAOBAB_CHAIN_ID,
    networkId: KLAYTN_BAOBAB_NETWORK_ID,
    ticker: KLAY_SYMBOL,
    logo: TestNetworkImages.baobab,
    coinType: 60,
    color: '#5C5C5C',
    isTest: true,
  },
  [POLYGON_MUMBAI]: {
    key: POLYGON_MUMBAI,
    name: POLYGON_MUMBAI_DISPLAY_NAME,
    rpcTarget: POLYGON_MUMBAI_RPC_URL,
    chainId: POLYGON_MUMBAI_CHAIN_ID,
    networkId: POLYGON_MUMBAI_NETWORK_ID,
    ticker: MATIC_SYMBOL,
    logo: TestNetworkImages.mumbai,
    coinType: 60,
    color: '#5C5C5C',
    isTest: true,
  },
  [BIFROST_TEST]: {
    key: BIFROST_TEST,
    name: BIFROST_TEST_DISPLAY_NAME,
    rpcTarget: BIFROST_TEST_RPC_URL,
    chainId: BIFROST_TEST_CHAIN_ID,
    networkId: BIFROST_TEST_NETWORK_ID,
    ticker: BIFROST_SYMBOL,
    logo: TestNetworkImages.bifrostTest,
    coinType: 60,
    color: '#5C5C5C',
    isTest: true,
  },
};

export const MAIN_NETWORKS_CHAIN_ID = Object.entries(MAIN_NETWORKS_MAP).map(
  ([_, network]) => network.chainId,
);
export const NETWORKS: { [key: string]: Network } = Object.assign(
  {},
  MAIN_NETWORKS_MAP,
  TEST_NETWORKS_MAP,
);
export const CHAIN_ID_TO_NETWORKS = Object.entries(MAIN_NETWORKS_MAP).reduce(
  (acc: any, [_, network]) => {
    acc[network.chainId] = network;
    return acc;
  },
  {},
);

export const NFT_SUPPORTED_MAINNET_CHAIN_IDS: string[] = [
  MAINNET_CHAIN_ID, // Ethereum Mainnet
  BSC_CHAIN_ID, // BSC(Binance Smart Chain) Mainnet
  AVAX_CHAIN_ID, // Avalanche Mainnet
  POLYGON_CHAIN_ID, // Polygon Mainnet
];
