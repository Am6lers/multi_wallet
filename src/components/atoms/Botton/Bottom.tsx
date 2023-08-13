import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  TouchableOpacityProps as RNTouchableOpacityProps,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Colors from '@constants/colors';
import Text from '../Text/Text';

interface TouchableOpacityProps extends RNTouchableOpacityProps {
  isBothSide?: boolean;
}

const Button = ({
  isBothSide = false,
  children,
  ...props
}: React.PropsWithChildren<TouchableOpacityProps>) => {
  return isBothSide ? (
    <View></View>
  ) : (
    <TouchableOpacity {...props} style={[styles.defaultStyle, props.style]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.Dark,
    paddingVertical: 16,
    borderRadius: 16,
  },
});

export default Button;
