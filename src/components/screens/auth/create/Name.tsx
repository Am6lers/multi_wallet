import React, { useEffect } from 'react';

import {
  View,
  Image,
  Button,
  Text,
  TextField,
  Spacings,
} from 'react-native-ui-lib';
import TL from '@translate/index';
import Colors from '@constants/colors';
import { StyleSheet } from 'react-native';
import CommonButton from '@components/atoms/CommonButton';
import Constants from '@constants/app';

const Name = ({
  moveToNext,
  setName,
}: {
  moveToNext: () => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [nickname, setNickname] = React.useState('');

  const goToNextStep = () => {
    setName(nickname);
    moveToNext();
  };

  return (
    <View style={styles.container}>
      <TextField
        placeholder={TL.t('initial.stpeBar.inputNickname')}
        floatingPlaceholder
        onChangeText={setNickname}
        floatingPlaceholderColor={Colors.Dark}
        maxLength={20}
        vali
        style={{ fontSize: 20 }}
        floatingPlaceholderStyle={{ fontSize: 20 }}
      />
      <CommonButton
        label={TL.t('initial.agree.next')}
        size={Button.sizes.large}
        onPress={goToNextStep}
        disabled={nickname.length <= 0}
      />
    </View>
  );
};

export default Name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Constants.PAGE_M1,
    paddingTop: Constants.WINDOW_HEIGHT / 5,
    justifyContent: 'space-between',
  },
});
