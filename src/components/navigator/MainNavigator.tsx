import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeTabNavigator from './HomeTabNavigator';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import engine from '@core/engine';
import { B_TRACKER_EVENTS } from '@scripts/controllers/balances';
import TokenList from '../screens/home/settings/detail/manage/TokenList';
import TokenDetail from '../screens/home/settings/detail/manage/TokenDetail';
import NFTList from '../screens/home/settings/detail/manage/NFTList';
import NFTDetail from '../screens/home/settings/detail/manage/NFTDetail';
import SendToken from '../screens/home/settings/detail/assets/SendToken';
import SendNFT from '../screens/home/settings/detail/assets/SendNFT';
import Receive from '../screens/home/settings/detail/assets/receive';
import Transactions from '../screens/home/settings/detail/assets/Transaction';
import SetSendTokenWhere from '../screens/home/settings/detail/assets/SetSendTokenWhere';
import SetSendTokenCharge from '../screens/home/settings/detail/assets/SetSendTokenCharge';
import SetSendTokenAmount from '../screens/home/settings/detail/assets/SetSendTokenAmount';
import SetSendNFTWhere from '../screens/home/settings/detail/assets/SetSendNFTWhere';
import SetSendNFTCharge from '../screens/home/settings/detail/assets/SetSendNFTCharge';
import SetSendNFTAmount from '../screens/home/settings/detail/assets/SetSendNFTAmount';

export interface LoginInfo {
  loginId: string;
  password: string;
}

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'MainStackNavigator'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen
        name="HomeTabNavigator"
        component={HomeTabNavigator}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="TokenList"
        component={TokenList}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="TokenDetail"
        component={TokenDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="NFTList"
        component={NFTList}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="NFTDetail"
        component={NFTDetail}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SendToken"
        component={SendToken}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SendNFT"
        component={SendNFT}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="Receive"
        component={Receive}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SetSendTokenWhere"
        component={SetSendTokenWhere}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SetSendTokenAmount"
        component={SetSendTokenAmount}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SetSendTokenCharge"
        component={SetSendTokenCharge}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SetSendNFTWhere"
        component={SetSendNFTWhere}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SetSendNFTAmount"
        component={SetSendNFTAmount}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen
        name="SetSendNFTCharge"
        component={SetSendNFTCharge}
        options={{ headerShown: true, title: '' }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
