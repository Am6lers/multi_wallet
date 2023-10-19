import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isExistAccountState } from '@store/atoms';
import Auth from '../screens/auth';
import Login from '../screens/login';
import Create from '../screens/auth/create';
import Done from '../screens/auth/done';
import MainStackNavigator from './MainNavigator';
import Import from '../screens/auth/import';
import Engine from '@core/engine';
import { has } from 'lodash';
import { useSelector } from 'react-redux';
import MakeWalletView from '../screens/home/wallet/makeNewWallet/MakeWalletView';
import MakeNewWallet from '../screens/home/wallet/makeNewWallet/index';
import PinSetting from '../screens/home/wallet/makeNewWallet/PinSetting';
import MakeDone from '../screens/home/wallet/makeDone/index';
import Backup from '../screens/home/backup';
import BackupFin from '../screens/home/backup/BackupFin';
import ProvideWalletRecovery from '../screens/home/backup/ProvideWalletRecovery';
import Wallet from '@components/screens/home/wallet';
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
  const isExistAccount = useSelector((state: any) => {
    if (
      has(state, ['engine', 'backgroundState', 'KeyringController', 'vault'])
    ) {
      return !!state.engine.backgroundState.KeyringController.vault;
    } else {
      return false;
    }
  });

  return (
    <Stack.Navigator
      initialRouteName={isExistAccount ? 'Login' : 'Auth'}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="Create"
        component={Create}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="Import"
        component={Import}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="Done"
        component={Done}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="MakeDone"
        component={MakeDone}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="MainStackNavigator" component={MainStackNavigator} />
      <Stack.Screen name="MakeWalletView" component={MakeWalletView} />
      <Stack.Screen name="MakeNewWallet" component={MakeNewWallet} />
      <Stack.Screen name="Backup" component={Backup} />
      <Stack.Screen name="BackupFin" component={BackupFin} />
      <Stack.Screen
        name="ProvideWalletRecovery"
        component={ProvideWalletRecovery}
      />
      {/* <Stack.Screen name="PinSetting" component={PinSetting} /> */}
    </Stack.Navigator>
  );
};

export default InitialStackNavigator;
