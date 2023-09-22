import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import { SpacingLiterals } from 'react-native-ui-lib/src/style/spacings';
import GoBack from '@assets/icons/goBack.svg';

const ListHeader = () => {
  return <View style={styles.container}></View>;
};

export default ListHeader;

const styles = StyleSheet.create({
  container: {
    paddingVertical: SpacingLiterals.s2,
    paddingHorizontal: SpacingLiterals.s3,
  },
});
