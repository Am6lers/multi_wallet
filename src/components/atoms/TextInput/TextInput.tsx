/* eslint-disable react-hooks/exhaustive-deps */
import Close from '@assets/icons/closeR.svg';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colorPalette } from '@common/Theme';
import { SizeStyle, WeightStyle } from '../Text/Text';
import { sizeStyles, weightStyles } from '../Text/fontStyles';
import config from '@config/index';

interface TextInputProps extends RNTextInputProps {
  sizeStyle?: SizeStyle;
  weightStyle?: WeightStyle;
  textColor?: string;
  isRightText?: boolean;
  placeholderStyle?: ViewStyle;
  newRef?: React.RefObject<RNTextInput>;
  textInputInnerStyle?: ViewStyle | any;
}

const TextInput = ({
  sizeStyle = 'f15',
  isRightText = false,
  weightStyle = 'regular',
  textColor = colorPalette.white,
  newRef = undefined,
  placeholderStyle,
  textInputInnerStyle = {},
  ...props
}: React.PropsWithChildren<TextInputProps>) => {
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [isActivateKeyboard, setIsActivateKeyboard] = useState<boolean>(false);
  const RNTextInputRef = useRef<RNTextInput>(null);
  const textInputRef = newRef || RNTextInputRef;
  const leftStyle: ViewStyle = isRightText
    ? { justifyContent: 'flex-end' }
    : {};
  const isShown = useMemo(
    () =>
      props.value !== undefined && props.value !== '' && props.value !== null,
    [props.value],
  );

  const textStyle = useMemo(() => {
    if (config.isIos()) {
      return {
        fontSize: sizeStyles[sizeStyle].fontSize,
        minHeight: sizeStyles[sizeStyle].lineHeight,
      };
    } else {
      return sizeStyles[sizeStyle];
    }
  }, []);

  const placeHolderStyleValue: ViewStyle = useMemo(() => {
    if (!props.value && placeholderStyle !== undefined) {
      return placeholderStyle;
    }
    return {};
  }, [props.value, placeholderStyle]);

  const placeHolderText: string | undefined = useMemo(() => {
    if (!props.value && props.placeholder !== undefined) {
      return props.placeholder;
    }
    return undefined;
  }, [props.value, props.placeholder]);

  const removeAll = useCallback(() => {
    props.onChangeText?.('');
    setShowDelete(false);
  }, []);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        textInputRef?.current?.blur();
        setIsActivateKeyboard(false);
        setShowDelete(false);
      },
    );
    const keyBoardDidShowListner = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsActivateKeyboard(true);
      },
    );

    return () => {
      keyBoardDidShowListner.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isShown && isActivateKeyboard) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
  }, [props.value]);

  return (
    <View style={[props.style, styles.outComp, leftStyle]}>
      <RNTextInput
        ref={newRef || textInputRef}
        {...props}
        placeholder={placeHolderText}
        style={[
          styles.textInput,
          textStyle,
          weightStyles[weightStyle],
          { fontSize: sizeStyles[sizeStyle].fontSize, color: textColor },
          placeHolderStyleValue,
          textInputInnerStyle,
        ]}
        onBlur={e => {
          setShowDelete(false);
          props.onBlur?.(e);
        }}
        onFocus={e => {
          if (isShown) {
            setShowDelete(true);
          }
          props.onFocus?.(e);
        }}
        onChangeText={(text: string) => {
          props.onChangeText?.(text);
        }}
        autoCorrect={false}
        returnKeyType={'done'}
        autoCapitalize={'none'}
        clearButtonMode="never"
        selectTextOnFocus
      />
      {showDelete && (
        <TouchableOpacity onPress={removeAll} style={styles.delete}>
          <Close stroke="rgba(0,0,0,0.35)" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  outComp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    padding: 0,
    width: '90%',
  },
  delete: {
    justifyContent: 'center',
    marginLeft: 10,
  },
});
