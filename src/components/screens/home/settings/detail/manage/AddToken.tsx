import {
  NavigationContainer,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { KeyboardAvoidingView, StyleSheet, Touchable } from 'react-native';
import {
  ActionSheet,
  BorderRadiuses,
  Button,
  ButtonSize,
  Image,
  Text,
  TextField,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import Colors from '@constants/colors';
import Header from '@components/atoms/Header';
import { useState } from 'react';
import React from 'react';
import TL from '@translate/index';
import Modal from 'react-native-modal';
import { set } from 'lodash';

const Stack = createNativeStackNavigator();

const TrimAddress = ({ address }: { address: string }) => {
  const trimmedAddress = `${address.substring(0, 10)}...${address.substring(
    address.length - 10,
  )}`;

  return (
    <View>
      <Text text90 marginB-10 color={Colors.Gray}>
        {trimmedAddress}
      </Text>
    </View>
  );
};

const AddToken = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [address, setAddress] = React.useState('');
  const [tokenName, setTokenName] = React.useState('');
  const [isValidate, setIsValidate] = React.useState(false);
  const [isShow, setIsShow] = useState(false);
  const handleToChange = (inputAddress: string) => {
    // 유효성 검사 (영문 대,소문자, 숫자만 가능하게)

    setAddress(inputAddress);
    // 정규식 사용해서 영문 대, 소문자, 숫자만 가능하게
    const pattern = /^0xdAC17F958D2ee523a2206206994597C13D831ec7*$/;
    setIsValidate(pattern.test(inputAddress));
  };

  const toggleModal = () => {
    setIsShow(!isShow);
  };

  const goToNextStep = () => {
    setAddress(address);
    setIsShow(true);
    // setComplete(true);
  };

  const selectToken = ({
    name,
    address,
  }: {
    name: string;
    address: string;
  }) => {
    setAddress(address);
    setTokenName(name);
    setIsShow(false);
    console.log(address);
    console.log(tokenName);
    navigation.reset({
      index: 0,
      routes: [{ name: 'ManageToken' }],
    });
  };

  return (
    <KeyboardAvoidingView style={styles.rootContainer} behavior="padding">
      <View style={styles.outline} useSafeArea>
        <View style={styles.container}>
          <Header />
          <View style={styles.notificationText}>
            <Text text50BO style={styles.notificationText}>
              {'추가할 토큰의 주소를 입력해주세요'}
            </Text>
          </View>
          <TextField
            placeholder={'추가하고 싶은 토큰의 주소를 입력해주세요'}
            enableErrors={true}
            autoFocus={true}
            onChangeText={handleToChange}
            validate={['required']}
            validationMessage={[TL.t('createNewWallet.name.validation')]}
            value={address}
            style={styles.textField}
            charCounterStyle={styles.charCounterStyle}
          />
          <View style={styles.alert}>
            {!isValidate && address.length !== 0 && (
              <Text style={styles.notiText}>{'검색 결과가 없어요'}</Text>
            )}

            <Button
              label={TL.t('initial.agree.next')}
              size={Button.sizes.large}
              borderRadius={15}
              backgroundColor={Colors.Navy}
              enableShadow={true}
              style={styles.button}
              disabled={!isValidate}
              onPress={goToNextStep}
            />
          </View>
        </View>
        <Modal
          testID={'modal'}
          isVisible={isShow}
          onSwipeComplete={toggleModal}
          swipeDirection={['up', 'left', 'right', 'down']}
          style={styles.view}
        >
          <View paddingT-30 style={styles.modalView}>
            <Text text50BL marginB-20>
              {'추가할 토큰을 선택하세요'}
            </Text>
            <TouchableOpacity
              margin-20
              padding-10
              marginB-40
              paddingH-60
              onPress={() =>
                selectToken({
                  name: 'Bitfrost',
                  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                })
              }
              style={styles.tokenCard}
            >
              <View>
                <Image
                  source={{
                    uri: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/avalanche/coin/coinImage.png',
                  }}
                  style={styles.image}
                />
              </View>
              <View>
                <Text text70BO>{'Bitfrost'}</Text>
                <TrimAddress address={address} />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
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
  alert: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: BorderRadiuses.br20,
    marginRight: Constants.PAGE_M2,
  },
  tokenCard: {
    flexDirection: 'row',
    borderBlockColor: Colors.Gray,
    borderLeftColor: Colors.Gray,
    borderRightColor: Colors.Gray,
    borderWidth: 0.5,
    borderRadius: 15,
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 24,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
export default AddToken;
// 0xdAC17F958D2ee523a2206206994597C13D831ec7
