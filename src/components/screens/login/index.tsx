import React, { useCallback, useEffect } from 'react';
import { View, Image } from 'react-native-ui-lib';
import { CIPHER_WITH_TITLE } from '@assets/images/roots';
import PinInput from '@components/organism/PinInput';
import { StyleSheet } from 'react-native';
import TL from '@translate/index';
import Colors from '@constants/colors';
import Engine from '@core/engine';
import Encryptor from '@core/Encryptor';
import { NativeModules } from 'react-native';
import MMKVStorage from '@utils/storage/mmkvStorage';
import SecureStorage from '@utils/storage/SecureStorage';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  // MMKVStorage.clear();
  // SecureStorage.clear();
  // AsyncStorage.clear();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const verifyHandler = useCallback(async (pins: string) => {
    try {
      const { KeyringController } = Engine.context;
      const result = await KeyringController.submitPassword(pins);
      if (result?.isUnlocked) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainStackNavigator' }],
        });
      }
      return result?.isUnlocked;
    } catch (e) {
      return false;
    }
  }, []);

  return (
    <View useSafeArea style={styles.container}>
      {/* <Image source={CIPHER_WITH_TITLE} /> */}
      <PinInput setPin={verifyHandler} cTitle={TL.t('login.title')} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
