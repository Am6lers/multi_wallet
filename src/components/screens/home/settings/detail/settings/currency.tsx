import React, { FC } from 'react';
import { View } from 'react-native-ui-lib';
import { Text, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types/navigation';

// type ManageWalletNavigationProp = NativeStackNavigationProp<RootStackParamList['APP']['Settings'], 'ManageWallet'>;

// type ManageWalletScreenRouteProp = RouteProp<RootStackParamList['APP']['Settings'], 'ManageWallet'>;

// type Props = {
//     navigation: ManageWalletNavigationProp
//     route: ManageWalletScreenRouteProp
// }

const Currency = () => {
    return (
      <View style={styles.outline} useSafeArea>
        <View style={styles.container}>
          <Text>Manage Token</Text>
        </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.White,
      paddingHorizontal: Constants.PAGE_M1,
    },
    outline: {
      flex: 1,
    },
  });



export default Currency;