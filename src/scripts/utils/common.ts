import BigNumber from 'bignumber.js';
import { stripHexPrefix } from 'ethereumjs-util';
import Moment from 'moment';
import URLParse from 'url-parse';
import { MAINNET_CHAIN_ID, TEST_CHAINS } from '@constants/network';
import { hexToBn } from '../../scripts/lib/util';
import { activeTab } from '../../types/app';
import {
  ControllerState,
  DomainPermissions,
  DomainPermissionsItem,
  LegacyGasFeeEstimates,
} from '../../types/controllerState';
import { EthToken } from '../../types/token';

const MAX = Number.MAX_SAFE_INTEGER;
let idCounter = Math.round(Math.random() * MAX);

export function createRandomId(): number {
  idCounter %= MAX;
  idCounter += 1;
  return idCounter;
}

export function isInfuraUrl(argUrl: string): boolean {
  try {
    /*
      *** BPW-013 위험한 URL 문자열 처리 ***
      url을 문자열 처리가 아닌 URL 파서를 이용하여 정규화를 진행 및 구성 요소에 대해 추가적인 처리
    */
    const parsedUrl = URLParse(argUrl);
    return (
      parsedUrl.host !== null &&
      parsedUrl.pathname !== null &&
      parsedUrl.host.endsWith('.infura.io') &&
      parsedUrl.pathname.split('/')[1] === 'v3'
    );
  } catch {
    return false;
  }
}

export function isNotCurrentRoute({
  currentRoute,
  routes,
}: {
  currentRoute: string;
  routes: string[];
}): boolean {
  const result = routes.filter(route => route === currentRoute);
  return result.length <= 0;
}

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function isNativeToken(address: string): boolean {
  return Number(hexToBn(address).toString()) === 0;
}

export function getOriginOfCurrentTab(actTab: activeTab) {
  return actTab.origin;
}

export function getPermissionDomainsMetadata(state: ControllerState) {
  return state?.domainMetadata || {};
}

export function getPermissionDomains(state: ControllerState) {
  return state?.domains || {};
}

export function getPermittedAccountsByOrigin(state: ControllerState) {
  const domains = getPermissionDomains(state);
  return Object.keys(domains).reduce((acc: any, domainKey: string) => {
    const accounts = getAccountsFromPermission(
      getAccountsPermissionFromDomain(domains[domainKey]),
    );
    if (accounts.length > 0) {
      acc[domainKey] = accounts;
    }
    return acc;
  }, {});
}

function getAccountsFromPermission(
  accountsPermission: DomainPermissionsItem[] | any,
) {
  const accountsCaveat = getAccountsCaveatFromPermission(accountsPermission);
  return accountsCaveat && Array.isArray(accountsCaveat.value)
    ? accountsCaveat.value
    : [];
}

function getAccountsPermissionFromDomain(domain: DomainPermissions) {
  return Array.isArray(domain.permissions)
    ? domain.permissions.find(
        (perm: DomainPermissionsItem) =>
          perm.parentCapability === 'eth_accounts',
      ) ?? {}
    : {};
}

function getAccountsCaveatFromPermission(accountsPermission: any = {}) {
  return (
    Array.isArray(accountsPermission.caveats) &&
    accountsPermission.caveats.find((c: any) => c.name === 'exposedAccounts')
  );
}

export function getAddressConnectedDomainMap(state: ControllerState) {
  const domainMetadata = getPermissionDomainsMetadata(state);
  const accountsMap = getPermittedAccountsByOrigin(state);
  const addressConnectedIconMap: any = {};
  Object.keys(accountsMap).forEach(domainKey => {
    const { icon, name } = domainMetadata[domainKey] || {};

    accountsMap[domainKey].forEach((address: string) => {
      const nameToRender = name || domainKey;

      addressConnectedIconMap[address] = addressConnectedIconMap[address]
        ? {
            ...addressConnectedIconMap[address],
            [domainKey]: { icon, name: nameToRender },
          }
        : { [domainKey]: { icon, name: nameToRender } };
    });
  });

  return addressConnectedIconMap;
}

export function getConnectedAddress({
  maps,
  domain,
}: {
  maps: any;
  domain: string;
}): string[] {
  const domainKeys = Object.keys(maps || {});
  if (!domainKeys.length) {
    return [];
  }
  const res: string[] = [];
  for (let i = 0; i < domainKeys.length; i++) {
    const address = domainKeys[i];
    const map = maps?.[address];
    if (map && map[domain]) {
      res.push(address);
    }
  }
  return res;
}

export function checkNetworkAndAccountSupports1559(state: ControllerState) {
  const networkSupports1559 = isEIP1559Network(state);
  const accountSupports1559 = isEIP1559Account(state);

  return networkSupports1559 && accountSupports1559;
}

export function isEIP1559Network(state: ControllerState) {
  return state.networkDetails?.EIPS[1559] === true;
}

export function isEIP1559Account(state: ControllerState) {
  // Neither hardware wallet supports 1559 at this time
  return !isHardwareWallet(state);
}

export function isHardwareWallet(state: ControllerState) {
  const keyring = getCurrentKeyring(state);
  const type = keyring?.type;
  if (!type) {
    return false;
  }
  return keyring.type.includes('Hardware');
}

export function getCurrentKeyring(state: ControllerState) {
  const identity = getSelectedIdentity(state);

  if (!identity) {
    return null;
  }

  const simpleAddress = stripHexPrefix(identity.address).toLowerCase();

  const keyring = state.keyrings.find((kr: any) => {
    return (
      kr.accounts.includes(simpleAddress) ||
      kr.accounts.includes(identity.address)
    );
  });

  return keyring;
}

export function getSelectedIdentity(state: ControllerState) {
  const selectedAddress = getSelectedAddress(state);
  const { identities } = state;

  return identities[selectedAddress];
}

export function getSelectedAddress(state: ControllerState) {
  return state.selectedAddress;
}

export function getIsNonStandardEthChain(state: ControllerState) {
  return !(getIsMainnet(state) || getIsTestnet(state));
}

export function getIsMainnet(state: ControllerState) {
  const chainId = getCurrentChainId(state);
  return chainId === MAINNET_CHAIN_ID;
}

export function getIsTestnet(state: ControllerState) {
  const chainId = getCurrentChainId(state);
  return TEST_CHAINS.includes(chainId);
}

export function getCurrentChainId(state: ControllerState) {
  const { chainId } = state.provider;
  return chainId;
}

export function valuesFor(obj: any) {
  if (!obj) {
    return [];
  }
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

export const formatToDateTimeString = (
  date: number,
  fallback: string = 'YYYY.MM.DD HH:mm:ss',
): string => {
  return Moment(new Date(date)).format(fallback);
};

export const formatToDateTimeWithSkippableYearString = (
  date: number,
  fallback: string = 'MMM DD, YYYY HH:mm:ss',
  dateFormatForThisYear: string = 'MMM DD HH:mm:ss',
): string => {
  const nowMoment = Moment(new Date());
  const targetMoment = Moment(new Date(date));

  return targetMoment.format(
    nowMoment.year() === targetMoment.year() ? dateFormatForThisYear : fallback,
  );
};

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export const getUsedQuote = (state: ControllerState) =>
  getSelectedQuote(state) || getTopQuote(state);

export const getSelectedQuote = (state: ControllerState) => {
  const { selectedAggId, quotes } = getSwapsState(state);
  return quotes[selectedAggId as string | number];
};

export const getTopQuote = (state: ControllerState) => {
  const { topAggId, quotes } = getSwapsState(state);
  return quotes[topAggId as string];
};

export const getUsedSwapsGasPrice = (state: ControllerState) => {
  return (
    getSwapsState(state)?.customGasPrice ||
    (state.gasFeeEstimates as LegacyGasFeeEstimates)?.gasPrice
  );
};

const getSwapsState = (state: ControllerState) => state.swapsState;

export const getApproveTxParams = (state: ControllerState) => {
  const { approvalNeeded } =
    getSelectedQuote(state) || getTopQuote(state) || {};

  if (!approvalNeeded) {
    return null;
  }
  const data = getSwapsState(state)?.customApproveTxData || approvalNeeded.data;

  const gasPrice = getUsedSwapsGasPrice(state);
  return { ...approvalNeeded, gasPrice, data };
};

export const displayBalance = (balance: string, decimalPlace: number) => {
  return new BigNumber(balance).toFixed(decimalPlace, BigNumber.ROUND_DOWN);
};

export const isValidTokenMetadata = (tokenmeta: EthToken): boolean => {
  return Boolean(
    tokenmeta.address &&
      tokenmeta.symbol &&
      typeof tokenmeta.isNative === 'boolean' &&
      tokenmeta.decimals,
  );
};

export function rateLimit(
  limitCount: number,
  limitInterval: number,
  fn: Function,
) {
  let fifo: any[][] = [];

  // count starts at limit
  // each call of `fn` decrements the count
  // it is incremented after limitInterval
  let count = limitCount;

  function call_next(args) {
    setTimeout(function () {
      if (fifo.length > 0) {
        call_next();
      } else {
        count = count + 1;
      }
    }, limitInterval);

    let call_args = fifo.shift();

    // if there is no next item in the queue
    // and we were called with args, trigger function immediately
    if (!call_args && args) {
      fn.apply(args[0], args[1]);
      return;
    }

    fn.apply(call_args[0], call_args[1]);
  }

  return function rate_limited_function() {
    var ctx = this;
    var args = Array.prototype.slice.call(arguments);
    if (count <= 0) {
      fifo.push([ctx, args]);
      return;
    }

    count = count - 1;
    call_next([ctx, args]);
  };
}
