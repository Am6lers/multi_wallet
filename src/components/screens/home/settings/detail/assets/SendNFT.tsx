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
  ListItem,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchField from '@components/atoms/SearchField';

export interface NFTItem {
  id: number;
  name?: string;
  image?: string;
  description?: string;
  standard?: string;
  soulbound?: boolean;
  amount: number;
}

export const NFTitems: NFTItem[] = [
  {
    id: 0,
    name: '#0000',
    image: 'https://i.seadn.io/s/raw/files/b915d9ab2718f1b2d9a3dc4c79c99430.png?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: false,
    amount: 1,
  },
  {
    id: 1,
    name: '#0000',
    image: 'https://i.seadn.io/gae/RBX3jwgykdaQO3rjTcKNf5OVwdukKO46oOAV3zZeiaMb8VER6cKxPDTdGZQdfWcDou75A8KtVZWM_fEnHG4d4q6Um8MeZIlw79BpWPA?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 2,
  },
  {
    id: 2,
    name: '#0000',
    image: 'https://i.seadn.io/s/raw/files/19e4902580b6488e6f8da66fbdad5e2d.png?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    id: 3,
    name: '#0000',
    image: 'https://i.seadn.io/s/raw/files/30d1b38e8895ee9e8a962180f696d38e.png?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    id: 4,
    name: '#0000',
    image: 'https://i.seadn.io/gae/ppMol-GqnTJ3-D698dX6hfIk2LBmk-x-bwalMcHrjry0zttv5upSAJY4aYJWLPrmW7ps544qm3TvxoOgNR6hPigIMrZhq3QkrCal?auto=format&dpr=1&h=500',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    id: 5,
    name: '#0000',
    image: 'https://i.seadn.io/gcs/files/37a55137d881df11271ce7acdcff7bf7.png?auto=format&dpr=1&h=500',
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
        <View marginV-5 padding-10 key={`${item.name}+${index}`}>
          <ListItem onPress={() => ItemPress(item)}>
            <ListItem.Part left>
              <View>
                <Image
                  borderRadius={BorderRadiuses.br100}
                  source={{ uri: item.image }}
                  style={{ width: 80, height: 80 }}
                />
              </View>
            </ListItem.Part>
            <ListItem.Part middle column>
              <View padding-20>
                <Text text80BO grey40>
                  Collection Name
                </Text>
                <Text text70BO>NFT Name {item.name}</Text>
                <Text text90BO grey50>
                  {item.standard}
                </Text>
              </View>
            </ListItem.Part>
          </ListItem>
        </View>
      )}
      numColumns={1}
      itemSpacing={Spacings.s3}
      listPadding={Spacings.s5}
      keyExtractor={(item, index) => `${item.name}+${index}`}
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
