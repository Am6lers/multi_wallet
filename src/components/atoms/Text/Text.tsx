import * as React from 'react';
import {
  ColorValue,
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';
import { sizeStyles, weightStyles } from './fontStyles';

export type SizeStyle = keyof typeof sizeStyles;
export type WeightStyle = keyof typeof weightStyles;

interface TextProps extends RNTextProps {
  sizeStyle?: SizeStyle;
  weightStyle?: WeightStyle;
  colorStyle?: string;
}

//font size, font weight 조절을 위한 custom text 컴포넌트.
const Text = ({
  children,
  colorStyle = 'black',
  sizeStyle = 'f16',
  weightStyle = 'regular',
  style,
  ...props
}: React.PropsWithChildren<TextProps>) => {
  return (
    <RNText
      style={[
        style,
        { color: colorStyle as ColorValue },
        sizeStyles[sizeStyle],
        weightStyles[weightStyle],
        { fontSize: sizeStyles[sizeStyle].fontSize },
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
