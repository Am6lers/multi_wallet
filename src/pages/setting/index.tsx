import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Setting = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return <View style={styles.container}></View>;
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSize: {
    fontSize: 20,
  },
});
