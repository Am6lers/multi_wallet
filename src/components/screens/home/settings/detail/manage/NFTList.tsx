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
  id: number;
  name?: string;
  image?: string;
  description?: string;
  standard?: string;
  soulbound?: boolean;
  amount: number;
};


export const NFTitems: NFTItem[] = [
  {
    id: 0,
    name: 'Creatures #0000',
    image: 'https://i.seadn.io/s/raw/files/b915d9ab2718f1b2d9a3dc4c79c99430.png?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: false,
    amount: 1,
  },
  {
    id: 1,
    name: 'Creatures #0000',
    image: 'https://i.seadn.io/gae/RBX3jwgykdaQO3rjTcKNf5OVwdukKO46oOAV3zZeiaMb8VER6cKxPDTdGZQdfWcDou75A8KtVZWM_fEnHG4d4q6Um8MeZIlw79BpWPA?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 2,
  },
  {
    id: 2,
    name: 'Creatures #0000',
    image: 'https://i.seadn.io/s/raw/files/19e4902580b6488e6f8da66fbdad5e2d.png?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    id: 3,
    name: 'Creatures #0000',
    image: 'https://i.seadn.io/s/raw/files/30d1b38e8895ee9e8a962180f696d38e.png?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    id: 4,
    name: 'Creatures #0000',
    image: 'https://i.seadn.io/gae/ppMol-GqnTJ3-D698dX6hfIk2LBmk-x-bwalMcHrjry0zttv5upSAJY4aYJWLPrmW7ps544qm3TvxoOgNR6hPigIMrZhq3QkrCal?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    id: 5,
    name: 'Creatures #0000',
    image: 'https://i.seadn.io/gcs/files/37a55137d881df11271ce7acdcff7bf7.png?auto=format&dpr=1&h=500',
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
      renderItem={({ item }) => (
        <View marginV-20>
          <TouchableOpacity onPress={() => ItemPress(item)}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
            <Text text70BO>{item.name}</Text>
          </TouchableOpacity>
        </View>
      )}
      numColumns={2}
      itemSpacing={Spacings.s3}
      listPadding={Spacings.s5}
      keyExtractor={(item, index) => `${item.name}+${index}`}
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
