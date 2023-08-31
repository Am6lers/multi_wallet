import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native-ui-lib';
import Wallet from '@components/screens/home/wallet';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import engine from '@core/engine';
import { DisplayKeyring } from '@scripts/controllers/keyring';
import { useRecoilState } from 'recoil';
import { superMasterName } from '@store/atoms';

export type Props = {};

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  const [, setSuperMasterName] = useRecoilState(superMasterName);
  useEffect(() => {
    const {
      KeyringController,
      PreferencesController,
      BalanceTrackingController,
    } = engine.context;
    BalanceTrackingController.startPolling();
    const superAccount = KeyringController.getAllKeyrings().find(
      (keyring: DisplayKeyring) => keyring.superMaster == true,
    );
    const account = `${superAccount.accounts.evm}/${superAccount.accounts.btc}`;
    const identity = PreferencesController.getAccountIdentity(account);
    setSuperMasterName(identity.name);
    return () => {
      BalanceTrackingController.stopPolling();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Wallet'}
      // tabBar={props => <TabBar {...props} />}
    >
      <Tab.Screen name="Wallet" component={Wallet} />
      {/* <Tab.Screen name="HomeAction" component={SendSelectScreenNoBack} />
    <Tab.Screen name="HomeMenu" component={HomeTabMenu} /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Colors.White,
  },
});

export default HomeTabNavigator;
