import React, { useCallback, useMemo, useState } from 'react';

import { View, Image, Button, Text, Wizard } from 'react-native-ui-lib';
import Agree from './Agree';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Name from './Name';
import TL from '@translate/index';
import Password from './Password';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';

const Create = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  const getPageState = useCallback(
    (num: number) => {
      if (page > num) {
        return Wizard.States.COMPLETED;
      } else return Wizard.States.ENABLED;
    },
    [page],
  );

  const moveToNext = useCallback(() => {
    if (page < 2) {
      setPage(page + 1);
    } else {
      navigation.navigate('Done');
    }
  }, [page]);

  const pageRenderer = useCallback(() => {
    switch (page) {
      case 0:
        return <Agree moveToNext={moveToNext} />;
      case 1:
        return <Name moveToNext={moveToNext} setName={setName} />;
      case 2:
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
          label={TL.t('initial.stpeBar.nickname')}
        />
        <Wizard.Step
          state={getPageState(2)}
          label={TL.t('initial.stpeBar.password')}
        />
      </Wizard>
      {pageRenderer()}
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
