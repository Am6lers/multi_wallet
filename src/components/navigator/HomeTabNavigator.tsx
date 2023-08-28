import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native-ui-lib';
import Wallet from '@components/screens/home/wallet';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';

export type Props = {};

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
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
