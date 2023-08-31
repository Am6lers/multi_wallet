import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native-ui-lib';
import engine from '@core/engine';
import { B_TRACKER_EVENTS, BalancesData } from '@scripts/controllers/balances';

const TokenList = () => {
  const { BalanceTrackingController, AccountAssetController } = engine.context;
  const [BalancesData, setBalanceData] = useState<BalancesData>({});

  const balanceList = useMemo(() => {
    return Object.entries(BalancesData).map(([chainId, balances]) => {
      const token = AccountAssetController.getAllTokensByChainId().then(res => {
        console.log('Token test', res);
      });
      return {
        chainId,
        balances,
        // symbol: token
      };
    });
  }, []);

  useEffect(() => {
    BalanceTrackingController.hub.on(
      B_TRACKER_EVENTS.BALANCES_UPDATE,
      setBalanceData,
    );
  }, []);
  return <View>{}</View>;
};

export default TokenList;
