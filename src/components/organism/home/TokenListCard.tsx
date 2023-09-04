import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native-ui-lib';
import engine from '@core/engine';
import { B_TRACKER_EVENTS, BalancesData } from '@scripts/controllers/balances';
import { NATIVE_TOKEN_ADDRESS } from '@constants/asset';
import { BalanceMap } from 'eth-balance-checker/lib/common';

interface TokenData {
  token: {
    address: string;
    decimals: number;
    image: string;
    iconUrl: string;
    symbol: string;
    name: string;
    chainId: string;
  };
  balance: BalanceMap;
}

const TokenListCard = () => {
  const { BalanceTrackingController, AccountAssetController } = engine.context;
  const [balanceList, setBalanceList] = useState<TokenData[]>([]);

  useEffect(() => {
    getTokenData();
    BalanceTrackingController.hub.on(
      B_TRACKER_EVENTS.BALANCES_UPDATED,
      getTokenData,
    );
    return () => {
      BalanceTrackingController.hub.removeListener(
        B_TRACKER_EVENTS.BALANCES_UPDATED,
        getTokenData,
      );
    };
  }, []);

  const getTokenData = async (balancesData?: BalancesData) => {
    const balanceData =
      balancesData ?? BalanceTrackingController.getAddressesBalances();
    const data = (await Promise.all(
      Object.entries(balanceData)?.map(async ([chainId, balances]) => {
        const contract = Object.keys(balances)?.[0];
        const token = await AccountAssetController.getTokensByAddrAndChainId(
          contract,
          chainId,
        );
        return {
          token: token?.[0],
          balance: balances,
        };
      }),
    )) as TokenData[];
    setBalanceList(data);
  };

  return <View>{}</View>;
};

export default TokenListCard;
