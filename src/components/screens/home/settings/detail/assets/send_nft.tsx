import React from 'react';
import { View } from 'react-native-ui-lib';
import { Text, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';

const SendNFT = () => {
  return (
    <View style={styles.outline} useSafeArea>
    <View style={styles.container}>
        <Text>Manage Token</Text>
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
});

export default SendNFT;

