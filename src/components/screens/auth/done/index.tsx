import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Button, Text, Wizard } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import ActivateBio from './ActivateBio';
import SugestBackup from './SugestBackup';

const Done = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [page, setPage] = useState<number>(0);

  const moveToNext = useCallback(() => {
    if (page < 1) {
      setPage(page + 1);
    } else {
      navigation.reset({ routes: [{ name: 'MainStackNavigator' }] });
    }
  }, [page]);

  const pageRenderer = useCallback(() => {
    switch (page) {
      case 0:
        return <ActivateBio moveToNext={moveToNext} />;
      case 1:
        return <SugestBackup moveToNext={moveToNext} />;
    }
  }, [page]);

  return (
    <View useSafeArea={true} style={styles.container}>
      {pageRenderer()}
    </View>
  );
};

export default Done;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
