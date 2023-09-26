import React from 'react';
import { Button, Text, View } from 'react-native-ui-lib';
import { ListRenderItem, SectionList, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TL from '@translate/index';

type SendNavigationProp = NativeStackNavigationProp<RootStackParamList['APP']['Send'], 'SendScreen'>;
type SendScreenRouteProp = RouteProp<RootStackParamList['APP']['Send'], 'SendScreen'>;
type Props = {
  navigation: SendNavigationProp
  route: SendScreenRouteProp
}

const Send = () => {
  const navigation = useNavigation<SendNavigationProp>();
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <Text text40BO center>Which assets to send?</Text>
        <Button
          label="Token"
          onPress={() => navigation.navigate('SendToken')}
          marginT-20
        />
        <Button
          label="NFT"
          onPress={() => navigation.navigate('SendNFT')}
          marginT-20
        />
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
  item: {
    backgroundColor: Colors.White,
    padding: 10,
    marginVertical: 8,
  },
});

export default Send;

