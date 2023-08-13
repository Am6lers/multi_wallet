import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@constants/colors';
import Button from '@components/atoms/Botton/Bottom';
import Text from '@components/atoms/Text/Text';
import constants from '@constants/index';
import { girdStyle } from '@utils/styles';

const Sign = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const moveToImport = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={girdStyle(1).grid}>
        <Image
          source={require('@assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={girdStyle(1).grid}>
        <View style={girdStyle(1).grid} />
        <View style={girdStyle(1).grid}>
          <Button onPress={moveToImport}>
            <Text
              sizeStyle="f16"
              weightStyle="semiBold"
              colorStyle={Colors.White}
            >
              새 지갑 생성하기
            </Text>
          </Button>
          <Button onPress={() => navigation.navigate('Import')}>
            <Text>쓰던 지갑 불러오기</Text>
          </Button>
        </View>
        <View style={girdStyle(1).grid}>
          <View style={styles.slogunBox}>
            <Text style={styles.slogunText}>All Assets At A Glance</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  logo: {
    height: '60%',
    resizeMode: 'contain',
  },

  slogunBox: {
    flex: 1,
    zIndex: -1,
    justifyContent: 'flex-end',
  },
  slogunText: {
    textAlign: 'center',
    color: '#E4E4E4',
    fontSize: 15,
  },
});

export default Sign;
