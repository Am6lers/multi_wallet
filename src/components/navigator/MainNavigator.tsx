import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeTabNavigator from './HomeTabNavigator';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import engine from '@core/engine';
import { B_TRACKER_EVENTS } from '@scripts/controllers/balances';
import ManageWallet from '../screens/home/settings/detail/manage/manage_wallet';
import ManageToken from '../screens/home/settings/detail/manage/manage_token';
import Send from '../screens/home/settings/detail/assets/send';
import Receive from '../screens/home/settings/detail/assets/receive';

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
        name='ManageWallet'
        component={ManageWallet}
        options={{headerShown: true, title: ''}}
      />
      <Stack.Screen
        name='ManageToken'
        component={ManageToken}
        options={{headerShown: true, title: ''}}
      />
      <Stack.Screen
        name='Send'
        component={Send}
        options={{headerShown: true, title: ''}}
      />
      <Stack.Screen
        name='Receive'
        component={Receive}
        options={{headerShown: true, title: ''}}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
