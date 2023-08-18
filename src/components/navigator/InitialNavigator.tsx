import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilValue } from 'recoil';
import { isExistAccountState } from '@store/atoms';
import Auth from '../screens/auth';
import Login from '../screens/login';
// import { accountState } from '@atoms/walletState';

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

const InitialStackNavigator = () => {
  const isExistAccount = useRecoilValue(isExistAccountState);
  return (
    <Stack.Navigator
      initialRouteName={isExistAccount ? 'Login' : 'Auth'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default InitialStackNavigator;
