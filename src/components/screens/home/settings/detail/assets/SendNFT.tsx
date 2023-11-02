import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  View,
  Colors,
  Spacings,
  BorderRadiuses,
  GridList,
  Image,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchField from '@components/atoms/SearchField';

export interface NFTItem {
  title?: string;
  image?: string;
  description?: string;
  standard?: string;
  soulbound?: boolean;
  amount: number;
};

export const NFTitems: NFTItem[] = [
  {
    title: 'item 1',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: false,
    amount: 1,
  },
  {
    title: 'item 2',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 2,
  },
  {
    title: 'item 3',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    title: 'item 4',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    title: 'item 5',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    title: 'item 6',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
];


const NFTListView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const ItemPress = (item: NFTItem) => {
    if (item.amount > 1) {
      navigation.navigate('SetSendNFTAmount', { item: item });
    } else {
      navigation.navigate('SetSendNFTCharge', { item: item });
    }
  };

  return (
    <GridList
      data={NFTitems}
      renderItem={({ item, index }) => (
        <View marginV-5 padding-10 key={`${item.title}+${index}`}>
          <TouchableOpacity onPress={() => ItemPress(item)}>
            <View row>
              <Image
                borderRadius={BorderRadiuses.br100}
                source={{ uri: item.image }}
                style={{ width: 100, height: 100 }}
              />
              <View padding-20>
                <Text text70BO>Collection Name</Text>
                <Text text70BO>NFT Name {item.title}</Text>
                <Text text70BO>{item.standard}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
      numColumns={1}
      itemSpacing={Spacings.s3}
      listPadding={Spacings.s5}
    />
  );
};

const SendNFT = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View center marginT-10>
          <Text text40BO>Which NFT to send?</Text>
        </View>
        <SearchField text="Search Collections and NFT" />
        <NFTListView />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
});

export default SendNFT;
