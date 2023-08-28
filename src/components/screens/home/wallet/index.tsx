import React, { useEffect, useMemo } from 'react';
import { Card, Carousel, Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from '@constants/app';
import Engine from '@core/engine';
import { DEFAULT_TOKEN } from '@constants/asset';
import Header from '@components/organism/home/Header';
import MMKVStorage from '@utils/storage/mmkvStorage';
import SecureStorage from '@utils/storage/SecureStorage';

const Tab = createBottomTabNavigator();

const Wallet = () => {
  const [addresses, setAddresses] = React.useState<string[]>([]);

  useEffect(() => {
    const { KeyringController, PreferencesController } = Engine.context;
    console.log(KeyringController.getAllKeyrings());
    // MMKVStorage.clear();
    // SecureStorage.clear();
  }, []);

  return (
    <View style={styles.container} useSafeArea>
      <View style={styles.container}>
        <Header />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
});

export default Wallet;
