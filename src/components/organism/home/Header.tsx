import React, { useMemo } from 'react';
import engine from '@core/engine';
import { Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/Ionicons';
import { DisplayKeyring } from '@scripts/controllers/keyring';
import { useRecoilValue } from 'recoil';
import { superMasterName } from '@store/atoms';

const Header = () => {
  const masterName = useRecoilValue(superMasterName);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text text65BO>{masterName}</Text>
      </View>
      <View style={styles.row}>
        <EvilIcon name="search" size={24} style={styles.icon} />
        <Icon name="line-scan" size={24} style={styles.icon} />
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
  icon: {
    marginLeft: 10,
  },
});

export default Header;
