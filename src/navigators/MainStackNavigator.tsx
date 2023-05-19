import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

export interface LoginInfo {
  loginId: string;
  password: string;
}

export type SignUpStackParamList = {
  // SignUpPage: { loginInfo: LoginInfo };
  // DisabilityCertificatePage: undefined;
  // TermsPage: { loginInfo: LoginInfo };
  // UserTypeSelectPage: { loginInfo: LoginInfo };
  // DisabledPage: { loginInfo: LoginInfo };
  // ParentsPage: { loginInfo: LoginInfo };
  // SignUpCompletePage: undefined;
  // ServiceTermsPage: undefined;
};

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Tab'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen
        name="Tab"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
