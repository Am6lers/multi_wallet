import { StyleSheet } from 'react-native';

export const girdStyle = (value: number) =>
  StyleSheet.create({
    grid: {
      flex: value,
      width: '100%',
      alignItems: 'center',

      // backgroundColor: 'green',
    },
  });
