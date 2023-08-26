import React, { useEffect } from 'react';
import {
  Button,
  LoaderScreen,
  ProgressBar,
  Spacings,
  View,
} from 'react-native-ui-lib';
import CommonButton from '@components/atoms/CommonButton';
import TL from '@translate/index';
import { StyleSheet } from 'react-native';
import PinInput from '@components/organism/PinInput';

const Password = ({
  moveToNext,
  setPwd,
}: {
  moveToNext: () => void;
  setPwd: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const passwordHandler = (pwd: string) => {
    setPwd(pwd);
    moveToNext();
  };

  return (
    <View style={styles.container}>
      <PinInput isCreate={true} setPin={passwordHandler} />
    </View>
  );
};

export default Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Spacings.s2,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
});
