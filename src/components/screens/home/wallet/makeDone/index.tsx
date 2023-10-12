import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Button, Text, Wizard } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import ActivateBioAuth from './ActivateBioAuth';
import SuggestBackup from './SuggestBackup';

const MakeDone = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [page, setPage] = useState<number>(0);

  const moveToNext = useCallback(() => {
    if (page < 1) {
      setPage(page + 1);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainStackNavigator' }],
      });
    }
  }, [page]);

  const pageRenderer = useCallback(() => {
    switch (page) {
      case 0:
        return <ActivateBioAuth moveToNext={moveToNext} />;
      case 1:
        return <SuggestBackup moveToNext={moveToNext} />;
    }
  }, [page]);

  return (
    <View useSafeArea={true} style={styles.container}>
      {pageRenderer()}
    </View>
  );
};

export default MakeDone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
