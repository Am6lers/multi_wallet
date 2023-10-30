import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Password from '@components/screens/auth/create/Password';
import { useCallback, useEffect, useState } from 'react';
import { View, Wizard } from 'react-native-ui-lib';
import Engine from '@core/engine';
import Name from './Name';
import PinSetting from './PinSetting';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import * as bip39 from 'bip39';
import TL from '@translate/index';

const MakeNewWallet = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [page, setPage] = useState<number>(0);
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
    if (page < 1) {
      setPage(page + 1);
    } else {
      await createNewAccount(name, pwd);
      navigation.navigate('MakeDone');
    }
  }, [page]);

  const createNewAccount = useCallback(async (name, pwd) => {
    Engine;
    const mnemonic = bip39.generateMnemonic(128);
    const result = await Engine.methods.importAccountWithSeed(mnemonic, name);
  }, []);

  const pageRenderer = useCallback(() => {
    switch (page) {
      case 0:
        return <Name moveToNext={moveToNext} setName={setName} />;
      case 1:
        return <PinSetting moveToNext={moveToNext} setPwd={setPwd} />;
      default:
        <Name moveToNext={moveToNext} setName={setName} />;
    }
  }, [page]);
  return (
    <View useSafeArea={true} style={styles.container}>
      <Wizard activeIndex={page}>
        <Wizard.Step
          state={getPageState(0)}
          label={TL.t('createNewWallet.wizard.settingWalletName')}
        />
        <Wizard.Step
          state={getPageState(1)}
          label={TL.t('createNewWallet.wizard.settingPin')}
        />
        <Wizard.Step
          state={getPageState(2)}
          label={TL.t('createNewWallet.wizard.complete')}
        />
      </Wizard>
      {pageRenderer()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});

export default MakeNewWallet;
