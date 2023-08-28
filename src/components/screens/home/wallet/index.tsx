import React, { useEffect } from 'react';
import { Card, Carousel, Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from '@constants/app';
import Engine from '@core/engine';

const Tab = createBottomTabNavigator();

const Wallet = () => {
  useEffect(() => {
    const { PreferencesController } = Engine.context;
    console.log(PreferencesController.getSelectedAddress());
  }, []);
  return (
    <View style={styles.container} useSafeArea>
      <Card
        flex
        center
        onPress={() => console.log('pressed')}
        style={styles.card}
      ></Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  card: {
    maxHeight: Constants.WINDOW_HEIGHT / 5,
    width: '100%',
    backgroundColor: Colors.Dark,
  },
});

export default Wallet;
