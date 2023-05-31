import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilState } from 'recoil';
import { accountState } from '@atom/walletState';
import SignUp from '@pages/sigin/signup/index';
import Import from '@pages/sigin/import';
import Sign from '@pages/sigin';
import BioMetrics from '@pages/sigin/BioMetrics';
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
  const [isExistAccount] = useRecoilState(accountState);
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
