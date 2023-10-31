import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  BorderRadiuses,
  Spacings,
  TextField,
  View,
  Button,
  Switch,
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

const data: TokenItem[] = new Array(10).fill(0).map((_, index) => ({
  id: index,
  name: 'Token ' + index,
  symbol: 'SYM' + index,
  balance: 'Balance ' + index,
  price: 'Price ' + index,
  isShow: true,
}));
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
        <View paddingL-10 paddingR-10 paddingT-5>
          <Text>{item.name}</Text>
          <Text>{item.symbol}</Text>
          <Text>{item.balance}</Text>
          <Text>{item.price}</Text>
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
      <Header title={'토큰 관리'} rightIcon="add" action={moveToAddToken} />
      {/* <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      > */}
      <SearchField onTextChange={handleSearchTextChange} />
      <AssertScreen />
      <TokenListCard searchText={searchText} />
      {/* </ScrollView> */}
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
        placeholder={'🔍 이름/주소로 토큰을 검색해보세요'}
        // returnKeyType="search"
        containerStyle={styles.search}
        onChangeText={onTextChange}
      />
    </View>
  );
};

const AssertScreen = () => {
  return (
    <View marginB-10 style={styles.assert}>
      <Text color={Colors.Gray} text60BL marginB-10>
        {'총 자산'}
      </Text>
      <Text text30BO style={styles.assertDeco}>
        {'$0,000,000.00'}
      </Text>
      <Text color={Colors.Gray}>{'숨겨진 자산이 포함된 금액이에요.'}</Text>
    </View>
  );
};

const TokenListCard: React.FC<{ searchText: string }> = ({ searchText }) => {
  const filteredData = searchText
    ? data.filter(
        item =>
          item.name.includes(searchText) || item.balance.includes(searchText),
      )
    : data;
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
  assert: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  assertDeco: {
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
});

export default ManageToken;
