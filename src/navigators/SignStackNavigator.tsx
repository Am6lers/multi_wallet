import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '@pages/signup';
import { useRecoilState } from 'recoil';
import { accountState } from '@atom/walletState';

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
      initialRouteName={isExistAccount ? 'Login' : 'Signup'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen name="Signup" component={SignUp} />
    </Stack.Navigator>
  );
};

export default SignStackNavigator;
