import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import { ManageWallet, ManageToken } from '../screens/home/settings/detail/manage';
import SettingScreen from '../screens/home/settings';
import { RootStackParamList } from 'types/navigation';
import ManageToken from '../screens/home/settings/detail/manage/manage_token';
import ManageWallet from '../screens/home/settings/detail/manage/manage_wallet';
import Send from '../screens/home/settings/detail/assets/send';
import Receive from '../screens/home/settings/detail/assets/receive';

const Stack = createNativeStackNavigator<RootStackParamList['APP']['Settings']>();

const SettingNavigator: FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SettingScreen'>
        <Stack.Screen 
          name='SettingScreen'
          component={SettingScreen} 
          options={{headerShown: false }} 
        />
        <Stack.Screen
          name='ManageWallet'
          component={ManageWallet}
          options={{headerShown: false }}
        />
        <Stack.Screen
          name='ManageToken'
          component={ManageToken}
          options={{headerShown: false }}
        />
        <Stack.Screen
          name='Send'
          component={Send}
          options={{headerShown: false }}
        />
        <Stack.Screen
          name='Receive'
          component={Receive}
          options={{headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SettingNavigator;

