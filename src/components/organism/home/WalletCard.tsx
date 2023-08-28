import React from 'react';
import { StyleSheet } from 'react-native';
import Constants from '@constants/app';
import { Card, Colors, View } from 'react-native-ui-lib';

const WalletCard = () => {
  return (
    <View>
      <Card
        flex
        center
        onPress={() => console.log('pressed')}
        style={styles.card}
      ></Card>
    </View>
  );
};

export default WalletCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  card: {
    maxHeight: Constants.WINDOW_HEIGHT / 5,
    width: '100%',
    backgroundColor: Colors.PointColor,
  },
});
