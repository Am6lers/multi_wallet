import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  BorderRadiuses,
  Spacings,
  TextField,
  View,
  Button,
  Switch,
  Image,
  TouchableOpacity,
} from 'react-native-ui-lib';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import Header from '@components/atoms/Header';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { CIPHER_LOGO } from '@/assets/images/roots';

const Receive = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const moveToAddToken = () => {
    navigation.navigate('AddToken');
  };

  return (
    <View style={styles.outline} useSafeArea>
      <Header />
      <View style={styles.container}>
        <View>
          <Text text40BL>{'아래 QR 코드로\n자산을 받을 수 있어요'}</Text>
        </View>
        <QRCode
          size={200}
          logo={CIPHER_LOGO}
          logoBackgroundColor="white"
          logoBorderRadius={14}
          value="0x7703f054f38Ed9472eFb65F8E9A8793fbCd0bd708e"
        />
        <Text color={Colors.Gray}>
          {'0x7703f054f38Ed9472eFb65F8E9A8793fbCd0bd708e'}
        </Text>
        <View>
          <Button
            label={'주소 복사하기'}
            size={Button.sizes.large}
            borderRadius={15}
            // 버튼 색상은 Figma 참고해서 수정할 것
            backgroundColor={Colors.Navy}
            enableShadow={true}
            style={styles.button}
            onPress={() => {}}
          />
          <Button
            label={'주소 공유하기'}
            size={Button.sizes.large}
            borderRadius={15}
            // 버튼 색상은 Figma 참고해서 수정할 것
            backgroundColor={Colors.Gray}
            enableShadow={true}
            style={styles.button}
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Light0,
    paddingHorizontal: Constants.PAGE_M1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outline: {
    backgroundColor: Colors.Light0,
    flex: 1,
  },
  button: {
    marginBottom: 10,
    width: 340,
  },
});

export default Receive;
