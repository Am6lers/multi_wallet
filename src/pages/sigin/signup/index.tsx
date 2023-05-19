import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SignUp = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [passCode, setPassCode] = useState(['', '', '', '', '', '']);

  let numbers = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '0' },
  ];

  const onPressNumber = (num: string) => {
    let tempCode = [...passCode];
    for (var i = 0; i < tempCode.length; i++) {
      if (tempCode[i] === '') {
        tempCode[i] = num;
        break;
      }
    }
    setPassCode(tempCode);
  };

  const onPressCancel = () => {
    let tempCode = [...passCode];
    for (var i = tempCode.length - 1; i >= 0; i--) {
      if (tempCode[i] != '') {
        tempCode[i] = '';
        break;
      } else {
        continue;
      }
    }
    setPassCode(tempCode);
  };

  return (
    <View style={styles.container}>
      {/* 상단 제목 */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>PIN 비밀번호 입력</Text>
        <Text style={styles.subTitle}>6자리 숫자를 입력해주세요</Text>
      </View>
      {/* 핀 입력 동그라미 */}
      <View style={styles.codeContainer}>
        {passCode.map((p, index) => {
          let style = p != '' ? styles.code2 : styles.code;
          return <View key={index} style={style}></View>;
        })}
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.numbersContainer}>
          {numbers.map(n => {
            return (
              <TouchableOpacity
                style={styles.number}
                key={n.id}
                onPress={() => onPressNumber(n.id)}
              >
                <Text style={styles.numberText}>{n.id}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => onPressCancel()}>
          <Text style={styles.fontSize}>지우기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PinInput')}>
          <Text style={styles.fontSize}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: '20%',
    marginBottom: '10%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#BABABA',
  },
  fontSize: {
    fontSize: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '30%',
  },
  code: {
    width: 13,
    height: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'black',
  },
  code2: {
    width: 13,
    height: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'pink',
    backgroundColor: 'pink',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 58,
    width: 300,
    height: 348,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    width: 75,
    height: 75,
    margin: 5,
    borderRadius: 75,
    backgroundColor: 'rgba(247, 156, 156, 0.3)',
    justifyContent: 'center',
    alignContent: 'center',
  },
  numberText: {
    fontSize: 36,
    letterSpacing: 0,
    textAlign: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
