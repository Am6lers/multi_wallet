import {
  AVAX,
  AVAXTEST,
  AVAX_CHAIN_ID,
  AVAX_TEST_CHAIN_ID,
  BIFROST,
  BIFROST_CHAIN_ID,
  BIFROST_TEST,
  BIFROST_TEST_CHAIN_ID,
  BSC,
  BSCTEST,
  BSCTEST_CHAIN_ID,
  BSC_CHAIN_ID,
  GOERLI,
  GOERLI_CHAIN_ID,
  INTERNALLY_USED_BITCOIN_CHAIN_ID,
  KLAYTN_BAOBAB,
  KLAYTN_BAOBAB_CHAIN_ID,
  KLAYTN_CYPRESS,
  KLAYTN_CYPRESS_CHAIN_ID,
  KOVAN_CHAIN_ID,
  LOCALHOST_CHAIN_ID,
  MAINNET,
  MAINNET_CHAIN_ID,
  MAX_SAFE_CHAIN_ID,
  NetworkImages,
  PILABTEST,
  POLYGON_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
  ROPSTEN_CHAIN_ID,
  TestNetworkImages,
} from '@constants/network';
//@ts-ignore
import { INFURA_PROJECT_ID } from '@env';

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

export const getTokenIcons = (chainId: string, address: string) => {
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
  } else if (PILABTEST === network) {
    url = 'http://192.168.0.155:8889';
  } else if (AVAX === network) {
    url = 'https://api.avax.network/ext/bc/C/rpc';
  } else if (AVAXTEST === network) {
    url = 'https://api.avax-test.network/ext/bc/C/rpc';
  } else if (KLAYTN_CYPRESS === network) {
    url = 'https://cypress.chain.thebifrost.io';
  } else if (KLAYTN_BAOBAB === network) {
    url = 'https://api.baobab.klaytn.net:8651';
  } else if (BIFROST === network) {
    url = distributedUrlByRandomCondition([
      'https://public-01.mainnet.thebifrost.io/rpc',
      'https://public-02.mainnet.thebifrost.io/rpc',
    ]);
  } else if (BIFROST_TEST === network) {
    url = distributedUrlByRandomCondition([
      'https://public-01.testnet.thebifrost.io/rpc',
      'https://public-02.testnet.thebifrost.io/rpc',
    ]);
  } else {
    url = `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
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
  }
  // TODO: bifrost, BSC node 확인
  return url;
};
