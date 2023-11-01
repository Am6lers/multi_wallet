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
  TouchableOpacity,
} from 'react-native-ui-lib';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import Header from '@components/atoms/Header';
import UpVector from '@assets/icons/upVector.svg';
import DownVector from '@assets/icons/downVector.svg';
import TravelExplore from '@assets/icons/travel_explore.svg';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

interface TokenItem {
  id: number;
  name: string;
  symbol: string;
  balance: string;
  price: string;
  isShow: boolean;
}

interface TransactionItem {
  id: number;
  success: boolean;
  icon: string;
  symbol: string;
  amount: string;
  date: string;
  senderAddress: string;
  receiverAddress: string;
  charge: string;
  isShow: boolean;
  content: string;
}

const transactionDatas: TransactionItem[] = [
  {
    id: 0,
    success: true,
    icon: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/binance/coin/coinImage.png',
    symbol: 'ETH',
    amount: '+0,000.00',
    date: '2021-09-01',
    senderAddress: '0x121...5bb54',
    receiverAddress: '0x234...aabbb',
    charge: '00.00 ETH = $ 0.21',
    isShow: false,
    content: '보내기',
  },
  {
    id: 1,
    success: true,
    icon: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/klaytn/coin/coinImage.png',
    symbol: 'KLAY',
    amount: '+0,000.00',
    date: '2021-09-01',
    senderAddress: '0x121...5bb54',
    receiverAddress: '0x234...aabbb',
    charge: '00.00 KLAY = $ 0.21',
    isShow: false,
    content: '받기',
  },
  {
    id: 2,
    success: false,
    icon: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/klaytn/coin/coinImage.png',
    symbol: 'KLAY',
    amount: '+0,000.00',
    date: '2021-09-01',
    senderAddress: '0x121...5bb54',
    receiverAddress: '0x234...aabbb',
    charge: '00.00 KLAY = $ 0.21',
    isShow: false,
    content: 'WalletConnection',
  },
];

const TokenListItem: React.FC<{ item: TransactionItem }> = ({ item }) => {
  const [isShow, setIsShow] = useState(item.isShow);

  const toggleSwitch = () => {
    setIsShow(!isShow);
    console.log(isShow);
  };

  return (
    <View
      style={isShow ? styles.transactionCardOpen : styles.transactionCardClose}
    >
      <View style={{ justifyContent: 'space-between' }}>
        <View padding-10 style={styles.transactionCard}>
          <Text text70BO>
            {item.content + (item.success ? ' 완료' : ' 실패')}
          </Text>
          <TouchableOpacity onPress={toggleSwitch}>
            {isShow && <UpVector />}
            {!isShow && <DownVector />}
          </TouchableOpacity>
        </View>
        <View paddingL-10 paddingR-10 paddingT-5 style={styles.transactionCard}>
          <View>
            <Image
              marginT-15
              source={{
                uri: item.icon,
              }}
              style={styles.image}
            />
          </View>
          <View>
            <Text text70BO>{item.amount + ' ' + item.symbol}</Text>
          </View>
        </View>
        <Collapsible collapsed={!isShow}>
          <View margin-5 style={styles.transactionDetails}>
            <Text text80BO color={Colors.Gray}>
              {'거래 일시'}
            </Text>
            <Text color={Colors.Gray}>{item.date}</Text>
          </View>
          <View margin-5 style={styles.transactionDetails}>
            <Text text80BO color={Colors.Gray}>
              {'보낸 주소'}
            </Text>
            <Text color={Colors.Gray}>{item.senderAddress}</Text>
          </View>
          <View margin-5 style={styles.transactionDetails}>
            <Text text80BO color={Colors.Gray}>
              {'받은 주소'}
            </Text>
            <Text color={Colors.Gray}>{item.receiverAddress}</Text>
          </View>
          <View margin-5 style={styles.transactionDetails}>
            <Text text80BO color={Colors.Gray}>
              {'수수료'}
            </Text>
            <Text color={Colors.Gray}>{item.charge}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('Clicked!!');
            }}
          >
            <View marginT-30 style={styles.transactionCardBottom}>
              <TravelExplore />
              <Text text90BO color={Colors.Gray}>
                {'스캐너에서 직접 확인하기'}
              </Text>
            </View>
          </TouchableOpacity>
        </Collapsible>
      </View>
    </View>
  );
};

const Transactions = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const moveToAddToken = () => {
    navigation.navigate('AddToken');
  };

  return (
    <View style={styles.outline} useSafeArea>
      <Header title={TL.t('assets.transaction.header')} />
      <TransactionListCard />
    </View>
  );
};

const TransactionListCard: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Light0,
        paddingHorizontal: Constants.PAGE_M1,
      }}
    >
      <FlatList
        data={transactionDatas}
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
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionCardOpen: {
    height: 300,
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
  },
  transactionCardClose: {
    height: 120,
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
  },
  transactionDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  transactionCardBottom: {
    alignItems: 'center',
  },
});

export default Transactions;
