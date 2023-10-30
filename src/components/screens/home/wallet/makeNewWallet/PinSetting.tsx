import { StyleSheet } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TL from '@translate/index';
import Engine from '@core/engine';
import Constants from '@constants/app';
import Colors from '@constants/colors';
import { useCallback } from 'react';
import PinInput from '@components/organism/PinInput';
import Header from '@components/atoms/Header';

const PinSetting = ({
  moveToNext,
  setPwd,
}: {
  moveToNext: () => void;
  setPwd: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View useSafeArea style={styles.container}>
      <Header />
      <PinInput
        isCreate={true}
        setPin={setPwd}
        cTitle={TL.t('createNewWallet.pin.inputNewPwd')}
      />
    </View>
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
});
export default PinSetting;
