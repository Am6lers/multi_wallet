import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { sizeStyles, weightStyles } from './fontStyles';

export type SizeStyle = keyof typeof sizeStyles;
export type WeightStyle = keyof typeof weightStyles;

interface TextProps extends RNTextProps {
  sizeStyle?: SizeStyle;
  weightStyle?: WeightStyle;
}

//font size, font weight 조절을 위한 custom text 컴포넌트.
const Text = ({
  children,
  sizeStyle = 'f16',
  weightStyle = 'regular',
  style,
  ...props
}: React.PropsWithChildren<TextProps>) => {
  return (
    <RNText
      style={[
        style,
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
