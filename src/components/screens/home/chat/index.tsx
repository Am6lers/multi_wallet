import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import { View } from 'react-native-ui-lib';
import Constants from '@constants/app';

const Chat = () => {
  return <View style={styles.outline} useSafeArea></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
  cardList: {
    marginBottom: 16,
  },
});

export default Chat;
