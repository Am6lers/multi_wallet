import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { View, Image, Button, Text, Wizard } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import TL from '@translate/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import Agree from '@components/screens/auth/create/Agree';
import Name from '@components/screens/auth/create/Name';
import Password from '@components/screens/auth/create/Password';
import InputMnemonic from './InputMnemonic';
import Engine from '@core/engine';

interface Account {
  account: string;
  type: 'mnemonic' | 'privateKey';
}

const Import = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [page, setPage] = useState<number>(0);
  const [account, setAccount] = useState<Account>();
  const [name, setName] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  useEffect(() => {
    pwd.length > 0 && moveToNext();
  }, [pwd]);

  const getPageState = useCallback(
    (num: number) => {
      if (page > num) {
        return Wizard.States.COMPLETED;
      } else return Wizard.States.ENABLED;
    },
    [page],
  );

  const moveToNext = useCallback(async () => {
    if (page < 3) {
      setPage(page + 1);
    } else {
      await importNewAccount();
      navigation.navigate('Done');
    }
  }, [page, pwd]);

  const importNewAccount = useCallback(async () => {
    Engine;
    if (account) {
      if (account.type === 'mnemonic') {
        const result = await Engine.methods.createNewVaultAndRestore(
          pwd,
          account.account,
          name,
          false,
        );
      } else {
        await Engine.methods.createNewVaultAndRestoreByPrivateKey(
          pwd,
          {
            evm: account.account,
            btc: null,
          },
          name,
        );
      }
    }
  }, [account, name, pwd]);

  const pageRenderer = useCallback(() => {
    switch (page) {
      case 0:
        return <Agree moveToNext={moveToNext} />;
      case 1:
        return (
          <InputMnemonic moveToNext={moveToNext} setAccount={setAccount} />
        );
      case 2:
        return <Name moveToNext={moveToNext} setName={setName} />;
      case 3:
        return <Password moveToNext={moveToNext} setPwd={setPwd} />;
      default:
        return <Agree moveToNext={moveToNext} />;
    }
  }, [page]);

  return (
    <View useSafeArea={true} style={styles.container}>
      <Wizard activeIndex={page}>
        <Wizard.Step
          state={getPageState(0)}
          label={TL.t('initial.stpeBar.agree')}
        />
        <Wizard.Step
          state={getPageState(1)}
          label={TL.t('initial.stpeBar.account')}
        />
        <Wizard.Step
          state={getPageState(2)}
          label={TL.t('initial.stpeBar.nickname')}
        />
        <Wizard.Step
          state={getPageState(3)}
          label={TL.t('initial.stpeBar.password')}
        />
      </Wizard>
      {pageRenderer()}
    </View>
  );
};

export default Import;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
