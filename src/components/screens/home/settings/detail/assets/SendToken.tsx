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
  ListItem,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchField from '@components/atoms/SearchField';

export interface TokenItem {
  title: string;
  image: string;
  value: number;
  amount: number;
};

export const Tokenitems: TokenItem[] = [
  {
    title: 'Etherium',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
    value: 8850,
    amount: 4.92,
  },
  {
    title: 'Etherium',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
    value: 1000,
    amount: 4.92,
  },
  {
    title: 'Bifrost',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
    value: 1000,
    amount: 4.92,
  },
  {
    title: 'Bifrost',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
    value: 1000,
    amount: 4.92,
  },
  {
    title: 'USD Coin',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=026',
    value: 1000,
    amount: 4.92,
  },
  {
    title: 'USD Coin',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=026',
    value: 1000,
    amount: 4.92,
  },
];


const TokenListView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const ItemPress = (item: TokenItem) => {
    navigation.navigate('SetSendTokenWhere', { item: item });
  };

  return (
    <GridList
      data={Tokenitems}
      renderItem={({ item, index }) => (
        <ListItem onPress={() => ItemPress(item)} style={styles.charge}>
          <ListItem.Part left>
            <View>
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
                }}
                style={{ maxWidth: 30, maxHeight: 30 }}
              />
            </View>
          </ListItem.Part>
          <ListItem.Part middle column>
            <ListItem.Part>
              <View>
                <Text text70BO numberOfLines={1}>
                  Etherium
                </Text>
              </View>
              <View>
                <Text>$8,850.40</Text>
                <Text>4.92ETH</Text>
              </View>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      )}
      numColumns={1}
      keyExtractor={(item, index) => `${item.title}+${index}`}
    />
  );
};

const SendToken = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View center marginT-10>
          <Text text40BO>Which Token to send?</Text>
        </View>
        <SearchField text="Search for a token by name/address" />
        <TokenListView />
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
  charge: {
    backgroundColor: Colors.grey80,
    borderRadius: BorderRadiuses.br50,
    padding: Spacings.s3,
  },
});

export default SendToken;
