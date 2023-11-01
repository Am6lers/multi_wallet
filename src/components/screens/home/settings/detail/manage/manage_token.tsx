import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  BorderRadiuses,
  Spacings,
  TextField,
  View,
  Button,
  Switch,
  Image,
} from 'react-native-ui-lib';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import Header from '@components/atoms/Header';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface TokenItem {
  id: number;
  name: string;
  symbol: string;
  balance: string;
  price: string;
  isShow: boolean;
}

const dummyDatas: TokenItem[] = [
  {
    id: 0,
    name: 'Polygon',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/polygon/coin/coinImage.png',
    balance: '00.0000 MATIC',
    price: '$1,000.00',
    isShow: true,
  },
  {
    id: 1,
    name: 'Ethereum',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/ethereum/coin/coinImage.png',
    balance: '00.0000 ETH',
    price: '$1,000.00',
    isShow: true,
  },
  {
    id: 2,
    name: 'Avalanche',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/avalanche/coin/coinImage.png',
    balance: '00.0000 AVAX',
    price: '$1,000.00',
    isShow: true,
  },
  {
    id: 3,
    name: 'Binance',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/binance/coin/coinImage.png',
    balance: '00.0000 BNB',
    price: '$1,000.00',
    isShow: true,
  },
  {
    id: 4,
    name: 'Klaytn',
    symbol:
      'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/klaytn/coin/coinImage.png',
    balance: '00.0000 KLAY',
    price: '$1,000.00',
    isShow: true,
  },
];

const TokenListItem: React.FC<{ item: TokenItem }> = ({ item }) => {
  const [isShow, setIsShow] = useState(item.isShow);

  const toggleSwitch = () => {
    setIsShow(!isShow);
  };

  return (
    <View
      style={{
        height: 80,
        width: '90%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 15,
        marginTop: 20,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View paddingL-10 paddingR-10 paddingT-5 style={styles.tokenCard}>
          <View>
            <Image
              marginT-15
              source={{
                uri: item.symbol,
              }}
              style={styles.image}
            />
          </View>
          <View>
            <Text text70BO>{item.name}</Text>
            <Text>{item.balance}</Text>
            <Text>{item.price}</Text>
          </View>
        </View>
        <Switch
          marginT-25
          marginR-5
          value={isShow}
          onValueChange={toggleSwitch}
        />
      </View>
    </View>
  );
};

const ManageToken = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const moveToAddToken = () => {
    navigation.navigate('AddToken');
  };

  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={styles.outline} useSafeArea>
      <Header
        title={TL.t('tokenManagement.assets.header')}
        rightIcon="add"
        action={moveToAddToken}
      />
      <SearchField onTextChange={handleSearchTextChange} />
      <AssertScreen />
      <TokenListCard searchText={searchText} />
    </View>
  );
};

const SearchField = ({
  onTextChange,
}: {
  onTextChange: (text: string) => void;
}) => {
  return (
    <View>
      <TextField
        marginH-20
        marginB-30
        placeholder={TL.t('tokenManagement.assets.search')}
        // returnKeyType="search"
        containerStyle={styles.search}
        onChangeText={onTextChange}
      />
    </View>
  );
};

const totalAsset = dummyDatas
  .reduce((acc, item) => {
    const priceNumber = parseFloat(
      item.price.replace('$', '').replace(',', ''),
    );
    return acc + priceNumber;
  }, 0)
  .toFixed(2);

const AssertScreen = () => {
  return (
    <View marginB-10 style={styles.asset}>
      <Text color={Colors.Gray} text60BL marginB-10>
        {TL.t('tokenManagement.assets.total')}
      </Text>
      <Text text30BO style={styles.assetDeco}>
        {/* {'$0,000,000.00'} */}
        {'$' + totalAsset}
      </Text>
      <Text color={Colors.Gray}>{TL.t('tokenManagement.assets.sub')}</Text>
    </View>
  );
};

const TokenListCard: React.FC<{ searchText: string }> = ({ searchText }) => {
  const filteredData = searchText
    ? dummyDatas.filter(
        item =>
          item.name.includes(searchText) || item.balance.includes(searchText),
      )
    : dummyDatas;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Light0,
        paddingHorizontal: Constants.PAGE_M1,
      }}
    >
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TokenListItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Light0,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    backgroundColor: Colors.Light0,
    flex: 1,
  },
  search: {
    borderRadius: BorderRadiuses.br30,
    backgroundColor: Colors.White,
    padding: Spacings.s3,
  },
  asset: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetDeco: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'gray',
  },
  textColor: {
    color: Colors.Gray,
  },
  shadow: {
    borderRadius: BorderRadiuses.br60,
    width: '100%',
  },
  flatlist: {
    backgroundColor: Colors.White,
    borderRadius: BorderRadiuses.br60,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: BorderRadiuses.br20,
    marginRight: Constants.PAGE_M2,
  },
  tokenCard: {
    flexDirection: 'row',
  },
});

export default ManageToken;
