import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BioMetrics = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.reset({ routes: [{ name: 'MainStackNavigator' }] })
        }
      >
        <Text style={styles.fontSize}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BioMetrics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSize: {
    fontSize: 20,
  },
});
