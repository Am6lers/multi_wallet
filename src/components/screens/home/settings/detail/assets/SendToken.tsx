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
  id: number;
  name: string;
  symbol: string;
  balance: string;
  price: string;
}

const dummyDatas: TokenItem[] = [
  {
    id: 0,
    name: 'Ethereum',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/ethereum/coin/coinImage.png',
    balance: '4.92 ETH',
    price: '$8,850.40',
  },
  {
    id: 1,
    name: 'Ethereum',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/ethereum/coin/coinImage.png',
    balance: '00.0000 ETH',
    price: '$1,000.00',
  },
  {
    id: 2,
    name: 'Bifrost',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/bifrost/coin/coinImage.png',
    balance: '00.0000 BFC',
    price: '$1,000.00',
  },
  {
    id: 3,
    name: 'Bifrost',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/bifrost/coin/coinImage.png',
    balance: '00.0000 BFC',
    price: '$1,000.00',
  },
  {
    id: 4,
    name: 'USD Coin',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/klaytn/coin/coinImage.png',
    balance: '00.0000 USDC',
    price: '$1,000.00',
  },
  {
    id: 4,
    name: 'USD Coin',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/klaytn/coin/coinImage.png',
    balance: '00.0000 USDC',
    price: '$1,000.00',
  },
];

const TokenListView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const ItemPress = (item: TokenItem) => {
    navigation.navigate('SetSendTokenWhere', { item: item });
  };

  return (
    <GridList
      data={dummyDatas}
      renderItem={({ item, index }) => (
        <ListItem onPress={() => ItemPress(item)} style={styles.charge}>
          <ListItem.Part left>
            <View>
              <Image
                source={{
                  uri: item.symbol,
                }}
                style={{ width: 40, height: 40 }}
              />
            </View>
          </ListItem.Part>
          <ListItem.Part middle column>
            <ListItem.Part>
              <View marginL-5>
                <Text text70BO>{item.name}</Text>
              </View>
              <View right marginR-25>
                <Text>{item.price}</Text>
                <Text>{item.balance}</Text>
              </View>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      )}
      numColumns={1}
      keyExtractor={(item, index) => `${item.name}+${index}`}
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
