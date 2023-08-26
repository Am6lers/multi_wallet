import React from 'react';
import { View, Image, Button, ButtonSize } from 'react-native-ui-lib';
import { CIPHER_WITH_TITLE } from '@assets/images/roots';
import Colors from '@constants/colors';
import { StyleSheet, ViewStyle } from 'react-native';

const CommonButton = ({
  reverse = false,
  label,
  size = Button.sizes.large,
  style = {},
  disabled = false,
  multiDisabled = false,
  onPress,
  onPressOther,
  isMulti = false,
  secondLabel,
}: {
  reverse?: boolean;
  label: string;
  size?: ButtonSize;
  style?: ViewStyle;
  disabled?: boolean;
  multiDisabled?: boolean;
  onPress?: () => void;
  onPressOther?: () => void;
  isMulti?: boolean;
  secondLabel?: string;
}) => {
  if (isMulti) {
    return (
      <View style={styles.multiButtonContainer}>
        <Button
          label={secondLabel || 'First Button'}
          size={size}
          style={[styles.multiButtonFirst, style]}
          labelStyle={reverse ? styles.label : styles.reverseLabel}
          backgroundColor={reverse ? Colors.Dark : Colors.Light2}
          onPress={onPressOther}
          disabled={multiDisabled}
          disabledBackgroundColor={Colors.Light1}
        />
        <Button
          label={label || 'Second Button'}
          size={size}
          style={[styles.multiButtonSecond, style]}
          labelStyle={reverse ? styles.reverseLabel : styles.label}
          backgroundColor={reverse ? Colors.Light2 : Colors.Dark}
          onPress={onPress}
          disabled={disabled}
          disabledBackgroundColor={Colors.Light1}
        />
      </View>
    );
  }

  return (
    <Button
      label={label}
      size={size}
      style={[styles.button, style]}
      labelStyle={reverse ? styles.reverseLabel : styles.label}
      backgroundColor={reverse ? Colors.Light2 : Colors.Dark}
      onPress={onPress}
      disabled={disabled}
      disabledBackgroundColor={Colors.Light1}
    />
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  label: {
    color: Colors.White,
  },
  button: {
    height: 60,
  },
  reverseLabel: {
    color: Colors.Dark,
  },
  multiButtonContainer: {
    flexDirection: 'row',
  },
  multiButtonFirst: {
    flex: 1,
    height: 60,
    marginRight: 10,
  },
  multiButtonSecond: {
    flex: 3,
    height: 60,
  },
});
