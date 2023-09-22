import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BorderRadiuses, View } from 'react-native-ui-lib';
import engine from '@core/engine';
import {
  B_TRACKER_EVENTS,
  BalancesData,
  TokenData,
} from '@scripts/controllers/balances';
import { ASSET_EVENTS } from '@scripts/controllers/accountAsset';
import TokenListItem from '@components/atoms/TokenListItem';
import Animated from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import ListHeader from '@components/atoms/ListHeader';

const TokenListCard = () => {
  const { BalanceTrackingController, AccountAssetController } = engine.context;
  const [balanceList, setBalanceList] = useState<TokenData[]>([]);

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
    <Shadow offset={[0, 4]} distance={5} style={styles.shadow}>
      <Animated.FlatList
        scrollEnabled={false}
        style={styles.flatlist}
        data={balanceList}
        renderItem={TokenListItem}
        ListHeaderComponent={ListHeader}
      />
    </Shadow>
  );
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: BorderRadiuses.br60,
    width: '100%',
  },
  flatlist: {
    backgroundColor: Colors.White,
    borderRadius: BorderRadiuses.br60,
  },
});

export default TokenListCard;
