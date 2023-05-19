import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BioMetrics = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>간편 생체인증 설정</Text>
      <View style={{ flex: 8, paddingHorizontal: 10 }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'pink',
            justifyContent: 'flex-end',
          }}
        >
          <Text style={styles.scription}>
            본인확인 목적으로 기기에 등록된 모든 지문정보를 이용해 로그인을
            진행하며 서버로 전송/저장하지 않습니다.
          </Text>
          <View style={{ paddingVertical: 10 }} />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomLeft}
          onPress={() =>
            navigation.reset({ routes: [{ name: 'MainStackNavigator' }] })
          }
        >
          <Text style={styles.bottomText}>다음에</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomRight}
          onPress={() =>
            navigation.reset({ routes: [{ name: 'MainStackNavigator' }] })
          }
        >
          <Text style={styles.bottomText}>동의합니다.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BioMetrics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    padding: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  scription: {
    color: '#BABABA',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomLeft: {
    flex: 1,
    backgroundColor: '#FFCCE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRight: {
    flex: 1,
    backgroundColor: '#F561A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
