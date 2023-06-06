import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import OctionIcon from 'react-native-vector-icons/Octicons';
const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [cost, getCost] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.subBtnContainer}>
        <View style={styles.subBtnGroup}>
          <TouchableOpacity>
            <MCIcon name="line-scan" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 8 }} />
          <TouchableOpacity>
            <OctionIcon name="graph" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.assetContainer}>
        <Text style={styles.subText}>총 자산 Address: 0x19...cec7</Text>
        <Text style={styles.title}>$ {cost}</Text>
        <View style={styles.subBtnGroup2}>
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.btnText}>보내기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.receiveBtn}>
            <Text style={styles.btnText}>받기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tokenContainer}>
        <Text style={styles.title}>Token</Text>
        <View style={styles.listGroup}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.sampleImg} />
            <Text style={styles.listTitle}>ETH</Text>
          </View>
          <View>
            <Text style={styles.listCost}>0 ~ $ 0</Text>
            <Text style={styles.listSub}>0.0000 BTC</Text>
          </View>
        </View>
        {/*  */}
        <View style={styles.listGroup}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.sampleImg} />
            <Text style={styles.listTitle}>BFC</Text>
          </View>
          <View>
            <Text style={styles.listCost}>0 ~ $ 0</Text>
            <Text style={styles.listSub}>0.0000 BTC</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subBtnContainer: {
    width: '90%',
    alignItems: 'flex-end',
  },
  subBtnGroup: {
    flexDirection: 'row',
  },
  assetContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 20,
  },
  subText: {
    color: '#BABABA',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subBtnGroup2: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  sendBtn: {
    borderRadius: 15,
    width: 80,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F561A6',
    marginRight: 8,
  },
  receiveBtn: {
    borderRadius: 15,
    width: 80,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFCCE4',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  tokenContainer: {
    backgroundColor: 'white',
    width: '90%',
    minHeight: 400,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 20,
  },

  listGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'space-between',
  },

  sampleImg: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'gray',
    marginRight: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  listCost: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  listSub: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#BABABA',
  },
});
