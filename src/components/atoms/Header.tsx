import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native-ui-lib';
import GoBack from '@assets/icons/goBack.svg';
import Constants from '@constants/app';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Header = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <GoBack />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: Constants.PAGE_M1,
  },
});
