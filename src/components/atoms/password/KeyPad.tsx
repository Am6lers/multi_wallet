import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colorPalette } from '@common/Theme';
import config from '@config/index';
import Delete from '@assets/icons/delete.svg';
import Text from '../Text/Text';

const KeyPad = ({ password, setPassword, error }: any) => {
  return (
    <FlatList
      data={[1, 2, 3, 0]}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }: { item: number; index: number }) => {
        const number = item !== 0 ? item + index * 2 : 0;
        return (
          <View style={styles.row}>
            <TouchableOpacity
              style={number !== 0 ? styles.button : styles.nonButton}
              disabled={number === 0 || error || password.length >= 6}
              onPress={() => {
                setPassword(password + `${number}`);
              }}
            >
              {item !== 0 && (
                <Text sizeStyle="f20" style={styles.number}>{`${number}`}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              disabled={error || password.length >= 6}
              onPress={() => {
                setPassword(password + `${number !== 0 ? number + 1 : 0}`);
              }}
            >
              <Text sizeStyle="f20" style={styles.number}>{`${
                number !== 0 ? number + 1 : 0
              }`}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              disabled={error || password.length >= 6}
              onPress={() => {
                if (item !== 0) {
                  setPassword(password + `${number + 2}`);
                } else {
                  setPassword(password.slice(0, password.length - 1));
                }
              }}
            >
              {item !== 0 ? (
                <Text sizeStyle="f20" style={styles.number}>{`${
                  number + 2
                }`}</Text>
              ) : (
                <Delete />
              )}
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

export default KeyPad;

const styles = StyleSheet.create({
  button: {
    width: (config.WINDOW_WIDTH - 106) / 3,
    height: ((config.WINDOW_WIDTH - 106) / 3 / 98) * 65,
    backgroundColor: colorPalette.white8p,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6.5,
  },
  nonButton: {
    width: (config.WINDOW_WIDTH - 106) / 3,
    height: ((config.WINDOW_WIDTH - 106) / 3 / 98) * 51,
    borderRadius: 8,
    margin: 6.5,
  },
  row: {
    flexDirection: 'row',
  },
  number: {
    color: colorPalette.white,
  },
});
