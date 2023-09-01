import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilValue } from 'recoil';
import { isExistAccountState } from '@store/atoms';
import HomeTabNavigator from './HomeTabNavigator';
import CredentialDetail from '../screens/home/wallet/CredentialDetail';

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
        name="CredentialDetail"
        component={CredentialDetail}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
