import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from '@constants/index';
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@constants/colors';
import Text from '@components/atoms/Text/Text';
import Terms from './Terms';
import Modal from 'react-native-modal';

interface AgreeProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}

const Agree = ({}: AgreeProps) => {
  const [agree, setAgree] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const logo = useMemo(() => require('../../../../assets/images/logo.png'), []);

  const openModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

  const userAgree = () => {
    setAgree(true);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text sizeStyle="f20" weightStyle="bold" style={styles.text}>
          {'환영합니다!\n 회원가입을 위해 약관에 동의해주세요.'}
        </Text>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={openModal}>
          <Text sizeStyle="f13" weightStyle="bold" style={styles.text}>
            {'이용약관 '}
            <Text sizeStyle="f13" weightStyle="bold" style={styles.subText}>
              {'(필수)'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={visible}
        onBackdropPress={closeModal}
        style={styles.modal}
      >
        <Terms setAgree={userAgree} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: Constants.PADDING_HORIZONTAL_DEFAULT,
    // paddingVertical: Constants.PADDING_VERTICAL_DEFAULT,
    alignItems: 'center',
    marginVertical: '20%',
    justifyContent: 'space-between',
  },
  bottom: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
  logo: {
    height: '45%',
    resizeMode: 'contain',
    marginTop: '20%',
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: Colors.White,
    width: '100%',
    borderRadius: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'space-between',
  },
  subText: {
    color: Colors.Light2,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.White,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Agree;
