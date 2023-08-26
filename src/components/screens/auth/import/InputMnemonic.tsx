import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Image,
  Spacings,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import TL from '@translate/index';
import Colors from '@constants/colors';
import { StyleSheet } from 'react-native';
import Constants from '@constants/app';
import { validateMnemonic } from 'bip39';
import CommonButton from '@components/atoms/CommonButton';
import { clipPause, validatePrivateKey } from '@utils/accounts';

interface Account {
  account: string;
  type: 'mnemonic' | 'privateKey';
}

const InputMnemonic = ({
  moveToNext,
  setAccount,
}: {
  moveToNext: () => void;
  setAccount: (account: Account) => void;
}) => {
  const [data, setData] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(true);

  useEffect(() => {
    if (validateMnemonic(data)) {
      setAccount({ account: data, type: 'mnemonic' });
      setDisable(false);
    } else if (validatePrivateKey(data)) {
      setAccount({ account: data, type: 'privateKey' });
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [data]);

  const pause = useCallback(() => {
    clipPause(setData);
  }, []);

  return (
    <View style={styles.container} marginH={true} paddingT={true}>
      {/* <Image source={CIPHER_NAME} style={{ alignSelf: 'center' }} /> */}
      <View style={styles.inputBox}>
        <TextField
          placeholder={TL.t('initial.stpeBar.inputAccount')}
          floatingPlaceholder
          multiline
          autoFocus
          onChangeText={setData}
          floatingPlaceholderColor={Colors.Gray}
          containerStyle={styles.input}
          style={{ fontSize: 20 }}
          floatingPlaceholderStyle={{ fontSize: 20 }}
        />
        <Button
          style={styles.button}
          label={TL.t('initial.import.pase')}
          labelStyle={styles.label}
          onPress={pause}
          backgroundColor={Colors.PointColor}
        />
      </View>
      <CommonButton
        label={TL.t('initial.agree.next')}
        disabled={disable}
        onPress={moveToNext}
      />
    </View>
  );
};

export default InputMnemonic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Constants.PAGE_M1,
    paddingTop: Constants.WINDOW_HEIGHT / 7,
    justifyContent: 'space-between',
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: Constants.WINDOW_HEIGHT / 20,
  },
  input: {
    flex: 1,
  },
  button: {
    height: 32,
  },
  label: {
    fontSize: 14,
    lineHeight: 16,
  },
});
