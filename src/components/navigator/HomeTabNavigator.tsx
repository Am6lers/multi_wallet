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
import { B_TRACKER_EVENTS } from '@scripts/controllers/balances';
import Friends from '../screens/home/friends';
import Chat from '../screens/home/chat';
import SettingScreen from '../screens/home/settings';

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
    const superAccount = KeyringController.getAllKeyrings().find(
      (keyring: DisplayKeyring) => keyring.superMaster == true,
    );
    const account = `${superAccount.accounts.evm}/${superAccount.accounts.btc}`;
    const identity = PreferencesController.getAccountIdentity(account);
    setSuperMasterName(identity.name);
    BalanceTrackingController.hub.emit(B_TRACKER_EVENTS.UPDATE_BALANCES);
    return () => {};
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Wallet'}
      // tabBar={props => <TabBar {...props} />}
    >
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Chats" component={Chat} />
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Setting" component={SettingScreen} />
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
