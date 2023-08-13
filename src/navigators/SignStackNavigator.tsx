import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilValue } from 'recoil';
import { accountState } from '@atoms/walletState';
import SignUp from '@components/pages/sigin/signup/index';
import Import from '@components/pages/sigin/import';
import Sign from '@components/pages/sigin';
import BioMetrics from '@components/pages/sigin/BioMetrics';
import MainStackNavigator from './MainStackNavigator';

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

const SignStackNavigator = () => {
  const isExistAccount = useRecoilValue(accountState);
  return (
    <Stack.Navigator
      initialRouteName={isExistAccount ? 'Login' : 'Sign'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen name="Sign" component={Sign} />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Import"
        component={Import}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="BioMetrics"
        component={BioMetrics}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="MainStackNavigator"
        component={MainStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="Login" component={Login} /> */}
    </Stack.Navigator>
  );
};

export default SignStackNavigator;
