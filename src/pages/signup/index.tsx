import React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
  return (
    <LinearGradient
      colors={['#FDF0E9', '#FFB5C0']}
      style={{ width: '100%', height: '100%' }}
    >
      <SafeAreaView style={styles.container}>
        <View style={girdStyle(1).grid}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={girdStyle(1).grid}>
          <View style={girdStyle(1).grid} />
          <View style={girdStyle(1).grid}>
            <View style={styles.createBtn}>
              <Text style={styles.createBtnText}>새 지갑 생성하기</Text>
            </View>
            <View style={styles.callBackBtn}>
              <Text style={styles.callBackBtnText}>쓰던 지갑 불러오기</Text>
            </View>
          </View>
          <View style={girdStyle(1).grid}>
            <View style={styles.slogunBox}>
              <Text style={styles.slogunText}>All Assets At A Glance</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default SignUp;
