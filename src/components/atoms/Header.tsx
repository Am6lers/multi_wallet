import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import GoBack from '@assets/icons/goBack.svg';
import Add from '@assets/icons/Add.svg';
import Constants from '@constants/app';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Header = ({
  title,
  rightIcon,
  action,
}: {
  title?: string;
  rightIcon?: string;
  action?: () => void;
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <GoBack />
      </TouchableOpacity>
      <Text text60BL>{title}</Text>

      {rightIcon === 'add' && (
        <TouchableOpacity style={styles.rightIcon} onPress={action}>
          <Add />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 60,
    minWidth: Constants.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: Constants.PAGE_M1,
  },
  header: {
    position: 'absolute',
    left: 0,
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
  },
});
