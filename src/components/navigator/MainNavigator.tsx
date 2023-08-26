import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilValue } from 'recoil';
import { isExistAccountState } from '@store/atoms';
import Home from '../screens/home';

export interface LoginInfo {
  loginId: string;
  password: string;
}

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  const isExistAccount = useRecoilValue(isExistAccountState);
  return (
    <Stack.Navigator
      initialRouteName={'home'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
