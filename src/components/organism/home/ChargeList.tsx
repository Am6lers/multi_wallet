import React, { useCallback, useEffect, useState } from 'react';
import { BorderRadiuses, Colors } from 'react-native-ui-lib';
import engine from '@core/engine';
import { B_TRACKER_EVENTS, TokenData } from '@scripts/controllers/balances';
import { ASSET_EVENTS } from '@scripts/controllers/accountAsset';
import Animated from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { StyleSheet } from 'react-native';
import ListHeader from '@components/atoms/ListHeader';
import ChargeItem from '@components/atoms/ChargeItem';

const options = [{ speed: 'Fast' }, { speed: 'Medium' }, { speed: 'Slow' }];

const ChargeList = () => {
  const { BalanceTrackingController, AccountAssetController } = engine.context;
  const [balanceList, setBalanceList] = useState<TokenData[]>([]);
  const selectedIdx = 0;

  useEffect(() => {
    AccountAssetController.hub.on(ASSET_EVENTS.PRICES_UPDATED, updateTokenData);
    BalanceTrackingController.hub.on(
      B_TRACKER_EVENTS.BALANCES_UPDATED,
      updateTokenData,
    );
    updateTokenData();
    return () => {
      BalanceTrackingController.hub.removeListener(
        B_TRACKER_EVENTS.BALANCES_UPDATED,
        updateTokenData,
      );
      AccountAssetController.hub.removeListener(
        ASSET_EVENTS.PRICES_UPDATED,
        updateTokenData,
      );
    };
  }, []);

  const updateTokenData = useCallback(async () => {
    const data = await BalanceTrackingController.getTotalTokenData();
    setBalanceList(data);
  }, []);

  return (
    <Animated.FlatList
      scrollEnabled={false}
      style={styles.flatlist}
      data={balanceList.length > selectedIdx ? [balanceList[selectedIdx]] : []}
      renderItem={ChargeItem}
      ListHeaderComponent={ListHeader}
    />
  );
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: BorderRadiuses.br60,
    width: '100%',
  },
  flatlist: {
    backgroundColor: Colors.$backgroundNeutralMedium,
    borderRadius: BorderRadiuses.br60,
  },
});

export default ChargeList;
