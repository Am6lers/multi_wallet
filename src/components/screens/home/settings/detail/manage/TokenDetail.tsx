import React from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  View,
  Colors,
  Spacings,
  BorderRadiuses,
  GridList,
  Image,
  TouchableOpacity,
  Button,
  ListItem,
  SortableList,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';

type transactionItem = {
  time: string;
  sendingAddress: string;
  receivingAddress: string;
  amount: string;
};

const data: transactionItem[] = [
  {
    time: '12:00:00',
    sendingAddress: '0x00000000000',
    receivingAddress: '0x00000000000',
    amount: '0.00000000000',
  },
  {
    time: '12:00:00',
    sendingAddress: '0x00000000000',
    receivingAddress: '0x00000000000',
    amount: '0.00000000000',
  },
  {
    time: '12:00:00',
    sendingAddress: '0x00000000000',
    receivingAddress: '0x00000000000',
    amount: '0.00000000000',
  },
];

const TransactionItem = ({
  item,
  index,
}: {
  item: transactionItem;
  index: number;
}) => {
  return (
    <ListItem
      activeBackgroundColor={Colors.Gray}
      activeOpacity={0.3}
      height={77}
      onPress={() => {}}
      style={styles.container}
    >
      <ListItem.Part left></ListItem.Part>
      <ListItem.Part middle column containerStyle={styles.border}>
        <ListItem.Part containerStyle={{ paddingVertical: Spacings.s5 }}>
          <Image
            source={{
              uri: 'https://ethereum.org/static/35454ef2502c2ae2f3b44c703d9fed4b/7db56/eth-diamond-black.webp',
            }}
            style={styles.image}
          />
          <View>
            <Text dark text80BO>
              balance
            </Text>
            <Text text90 grey40>
              address
            </Text>
          </View>
        </ListItem.Part>
        <ListItem.Part>
          <View>
            <Text text90 grey40>
              거래 일시
            </Text>
            <Text text90 grey40>
              보낸 주소
            </Text>
            <Text text90 grey40>
              보낸 주소
            </Text>
            <Text text90 grey40>
              보낸 주소
            </Text>
          </View>
          <View right>
            <Text text90 grey40 numberOfLines={1}>
              {item.time}
            </Text>
            <Text text90 grey40 numberOfLines={1}>
              {item.sendingAddress}
            </Text>
            <Text text90 grey40 numberOfLines={1}>
              {item.receivingAddress}
            </Text>
            <Text text90 grey40 numberOfLines={1}>
              {item.amount}
            </Text>
          </View>
        </ListItem.Part>
      </ListItem.Part>
    </ListItem>
  );
};

const TransactionList = () => {
  return (
    <FlatList
      data={data}
      renderItem={TransactionItem}
      style={styles.flatlist}
    />
  );
};

const TokenDetail = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View center>
          <Text>Network Name</Text>
          <View marginT-20 padding-5 row>
            <Text text50>100,123.00</Text>
            <Text text50 grey40>
              MANA
            </Text>
          </View>
          <Text text70 blue1>
            $213,212.00
          </Text>
        </View>
        <View center row padding-20>
          <Button marginR-5 backgroundColor={Colors.black} label="Receive" />
          <Button marginL-5 backgroundColor={Colors.black} label="Send" />
        </View>
        <TransactionList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacings.s8,
    paddingHorizontal: Spacings.s5,
  },
  outline: {
    flex: 1,
  },
  search: {
    borderRadius: BorderRadiuses.br30,
    backgroundColor: Colors.grey70,
    padding: Spacings.s3,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: BorderRadiuses.br20,
    marginRight: Constants.PAGE_M2,
  },
  border: {
    borderColor: Colors.grey1,
  },
  flex: {
    flex: 1,
  },
  flatlist: {
    backgroundColor: Colors.White,
    borderRadius: BorderRadiuses.br60,
  },
});

export default TokenDetail;
