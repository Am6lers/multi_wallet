import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import CommonButton from '@components/atoms/CommonButton';
import Constants from '@constants/app';
import { StyleSheet } from 'react-native';
import TL from '@translate/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';

const SuggestBackup = ({ moveToNext }: { moveToNext: () => void }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const moveToBackup = () => {
    navigation.navigate('Backup');
  };

  return (
    <View style={styles.container}>
      <Text text40 style={styles.title}>
        {TL.t('initial.backup.title')}
      </Text>
      <CommonButton
        label={TL.t('initial.backup.backup')}
        secondLabel={TL.t('initial.backup.skip')}
        // Go to backup
        onPress={moveToBackup}
        // Skip
        // 백업 뷰로 이동
        onPressOther={moveToNext}
        isMulti
      />
    </View>
  );
};

export default SuggestBackup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Constants.PAGE_M1,
    justifyContent: 'space-between',
    paddingTop: Constants.WINDOW_HEIGHT / 7,
  },
  title: {
    textAlign: 'center',
  },
});
