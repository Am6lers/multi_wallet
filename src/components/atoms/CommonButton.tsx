import React from 'react';
import { View, Image, Button, ButtonSize } from 'react-native-ui-lib';
import { CIPHER_WITH_TITLE } from '@assets/images/roots';
import Colors from '@constants/colors';
import { StyleSheet, ViewStyle } from 'react-native';

const CommonButton = ({
  reverse = false,
  lable,
  size,
  style = {},
}: {
  reverse?: boolean;
  lable: string;
  size: ButtonSize;
  style?: ViewStyle;
}) => {
  return (
    <Button
      label={lable}
      size={size}
      style={style}
      labelStyle={reverse ? styles.reverseLabel : styles.label}
      backgroundColor={reverse ? Colors.Light2 : Colors.Dark}
    />
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  label: {
    color: Colors.White,
  },
  reverseLabel: {
    color: Colors.Dark,
  },
});
