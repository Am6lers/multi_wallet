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

interface NFTItem {
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

const NFTGridView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const ItemPress = (item: NFTItem) => {
    navigation.navigate('NFTDetail', { item: item });
  };
  return (
    <GridList
      data={NFTitems}
      renderItem={({ item, index }) => (
        <View marginV-20 key={`${item.title}+${index}`}>
          <TouchableOpacity onPress={() => ItemPress(item)}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
            <Text text70BO>{item.title}</Text>
          </TouchableOpacity>
        </View>
      )}
      numColumns={2}
      itemSpacing={Spacings.s3}
      listPadding={Spacings.s5}
    />
  );
};

const NFTList = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View marginT-10>
          <Text text40BO>Collection Name</Text>
        </View>
        <NFTGridView />
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

export default NFTList;