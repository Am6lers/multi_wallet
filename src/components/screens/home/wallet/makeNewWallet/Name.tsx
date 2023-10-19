import {
  NavigationContainer,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, ButtonSize, Text, TextField, View } from 'react-native-ui-lib';
import Constants from '@constants/app';
import Colors from '@constants/colors';
import Header from '@components/atoms/Header';
import { useState } from 'react';
import React from 'react';
import TL from '@translate/index';

const Stack = createNativeStackNavigator();

const Name = ({
  moveToNext,
  setName,
}: {
  moveToNext: () => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [nickname, setNickname] = React.useState('');
  const [isValidate, setIsValidate] = React.useState(false);
  const handleToChange = (inputName: string) => {
    // 유효성 검사 (영문 대,소문자, 숫자만 가능하게)

    setNickname(inputName);
    // 정규식 사용해서 영문 대, 소문자, 숫자만 가능하게
    const pattern = /^[a-zA-Z0-9]*$/;
    setIsValidate(pattern.test(inputName));
  };

  const navigateToPinSetting = () => {
    // navigation.navigate('PinSetting', { name: name });
  };
  const goToNextStep = () => {
    setName(nickname);
    moveToNext();
  };

  return (
    <KeyboardAvoidingView style={styles.rootContainer} behavior="padding">
      <View style={styles.outline} useSafeArea>
        <View style={styles.container}>
          <Header />
          <View style={styles.notificationText}>
            <Text text50BO style={styles.notificationText}>
              {TL.t('createNewWallet.nickName.notificationWalletName')}
            </Text>
          </View>
          <TextField
            placeholder={TL.t('createNewWallet.nickName.walletName')}
            enableErrors={true}
            autoFocus={true}
            onChangeText={handleToChange}
            validate={['required']}
            validationMessage={[TL.t('createNewWallet.name.validation')]}
            value={nickname}
            style={styles.textField}
            charCounterStyle={styles.charCounterStyle}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {!isValidate && nickname.length !== 0 && (
              <Text style={styles.notiText}>
                {TL.t('createNewWallet.name.notificationRightName')}
              </Text>
            )}

            <Button
              label={TL.t('initial.agree.next')}
              size={Button.sizes.large}
              borderRadius={15}
              // 버튼 색상은 Figma 참고해서 수정할 것
              backgroundColor="navy"
              enableShadow={true}
              style={styles.button}
              disabled={!isValidate}
              onPress={goToNextStep}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  container: {
    flex: 1,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
  cardList: {
    marginBottom: 16,
  },
  notificationText: {
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    marginBottom: 30,
    width: 340,
  },
  notiText: { color: 'red', marginBottom: 15 },
  textField: { marginTop: 30, fontSize: 20, fontWeight: 'bold' },
  charCounterStyle: { fontWeight: 'bold', fontSize: 20 },
});
export default Name;
