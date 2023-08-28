import React, { useMemo } from 'react';
import engine from '@core/engine';
import { Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/Ionicons';

const Header = () => {
  const { PreferencesController } = engine.context;

  const accountName = useMemo(() => {
    const identity = PreferencesController.getSelectedIdentity();
    return identity.name;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text text65BO>{accountName}</Text>
      </View>
      <View style={styles.row}>
        <EvilIcon name="search" size={24} />
        <Icon name="line-scan" size={24} />
        {/* <EvilIcon name="bell" size={24} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Header;
