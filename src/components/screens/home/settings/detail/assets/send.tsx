import React, { FC } from 'react';
import { Text, Image, ListItem, View } from 'react-native-ui-lib';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types/navigation'

type SendNavigationProp = NativeStackNavigationProp<RootStackParamList['APP']['Send'], 'SendScreen'>;

type Props = {
  navigation: SendNavigationProp
}

type AssetsItem = {
  text?: string;
  icon?: string;
  action?: () => void;
};

const SendAssetList : FC<Props> = ({ navigation }) => {
  const assets = [
    {
      text: 'Token assets',
      icon: '',
      action: () => navigation.navigate('SendToken'),
    }, 
    {
      text: 'NFT assets',
      icon: '',
      action: () => navigation.navigate('SendNFT'),
    },
  ]
  const renderItem: ListRenderItem<AssetsItem> = ({ item }) => {
    if(!item) return null
    return (
      <View marginV-5 padding-10>
        <Text text70BO onPress={item.action}>{item.icon}{item.text}</Text>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={assets}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={renderItem}
        
        // stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const Send = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <SendAssetList navigation={useNavigation()} />
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

export default Send;