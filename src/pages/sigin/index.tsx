import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@constants/colors';

const Sign = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={girdStyle(1).grid}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={girdStyle(1).grid}>
        <View style={girdStyle(1).grid} />
        <View style={girdStyle(1).grid}>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.createBtnText}>새 지갑 생성하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callBackBtn}
            onPress={() => navigation.navigate('Import')}
          >
            <Text style={styles.callBackBtnText}>쓰던 지갑 불러오기</Text>
          </TouchableOpacity>
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
    height: '100%',
    resizeMode: 'contain',
  },
  createBtn: {
    backgroundColor: '#F561A6',
    width: '80%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  callBackBtn: {
    width: '80%',
    borderRadius: 15,
    borderColor: '#F561A6',
    borderWidth: 1,
    padding: 20,
  },
  createBtnText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600', // semi - bold
    fontSize: 15,
  },
  callBackBtnText: {
    textAlign: 'center',
    color: '#F561A6',
    fontWeight: '600', // semi - bold
    fontSize: 15,
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

const girdStyle = (value: number) =>
  StyleSheet.create({
    grid: {
      flex: value,
      width: '100%',
      alignItems: 'center',

      // backgroundColor: 'green',
    },
  });

export default Sign;
