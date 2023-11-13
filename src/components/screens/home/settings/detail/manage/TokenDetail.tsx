import React, { Component, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  ScrollView,
  SectionList,
  StyleSheet,
} from 'react-native';
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
  Modifiers,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { TokenItem } from './TokenList';
import simplelincions from 'react-native-vector-icons/SimpleLineIcons';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { G } from 'react-native-svg';
import Collapsible from 'react-native-collapsible';

interface TokenDetailProps {
  route: {
    params: {
      item: TokenItem;
    };
  };
}

type transactionItem = {
  type: string;
  time?: string;
  balance?: string;
  sendingAddress?: string;
  receivingAddress?: string;
  charge?: string;
  connectAddress?: string;
};

const WalletConnectTx = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <View padding-10>
      <View row>
        <Image
          source={{
            uri: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.png',
          }}
          style={{ width: 25, height: 25 }}
        />
        <Text marginL-5 text60>
          WalletConnect Tx
        </Text>

        <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? (
            <Icon name="arrow-up" size={20} style={{ marginLeft: 10 }} />
          ) : (
            <Icon name="arrow-down" size={20} style={{ marginLeft: 10 }} />
          )}
        </TouchableOpacity>
      </View>
      <View>
        <View row marginV-20>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/bifrost/coin/coinImage.png',
            }}
            style={{ width: 40, height: 40 }}
          />
          <Text text70 grey40 marginH-10 numberOfLines={2}>
            0xefa4856393e4d74361ee61e0145446237b1af38e
          </Text>
        </View>

        <Collapsible collapsed={isCollapsed} align="center">
          <View>
            <Text blue30 text70L>
              Check directly with the scanner ⌕
            </Text>
          </View>
        </Collapsible>
      </View>
    </View>
  );
};

const CollapsibleList = () => {
  const dummyDatas: transactionItem[] = [
    {
      type: 'connect',
      connectAddress: '0xefa4856393e4d74361ee61e0145446237b1af38e',
    },
    {
      type: 'Send',
      time: '13:50:36',
      balance: '0.00.00BFC',
      sendingAddress: '0x121.56b54',
      receivingAddress: '0x234.aabbb',
      charge: '0.21',
    },
    {
      type: 'Send',
      time: '13:50:36',
      balance: '0.00.00BFC',
      sendingAddress: '0x121.56b54',
      receivingAddress: '0x234.aabbb',
      charge: '0.21',
    },
    {
      type: 'Receive',
      time: '13:50:36',
      balance: '0.00.00BFC',
      sendingAddress: '0x121.56b54',
      receivingAddress: '0x234.aabbb',
      charge: '0.21',
    },
    {
      type: 'Receive',
      time: '13:50:36',
      balance: '0.00.00BFC',
      sendingAddress: '0x121.56b54',
      receivingAddress: '0x234.aabbb',
      charge: '0.21',
    },
  ];

  return (
    <FlatList
      data={dummyDatas}
      renderItem={({ item }) => <CollapsibleBox item={item} />}
      keyExtractor={(item, index) => `${item.time}+${index}`}
      numColumns={1}
      showsVerticalScrollIndicator={false}
    />
  );
};

const CollapsibleBox = ({ item }: { item: transactionItem }) => {
  if (item.type === 'connect') return <WalletConnectTx />;
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View padding-10>
      <View row>
        <Text text60>{item.type} 완료</Text>
        <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? (
            <Icon name="arrow-up" size={20} style={{ marginLeft: 10 }} />
          ) : (
            <Icon name="arrow-down" size={20} style={{ marginLeft: 10 }} />
          )}
        </TouchableOpacity>
      </View>
      <View>
        <View row spread marginV-20>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/bifrost/coin/coinImage.png',
            }}
            style={{ width: 40, height: 40 }}
          />
          <View right>
            {item.type === 'Send' ? (
              <View>
                <Text text80BO>-{item.balance}</Text>
                <Text text80BO grey40>
                  {item.sendingAddress}
                </Text>
              </View>
            ) : (
              <View>
                <Text text80BO>+{item.balance}</Text>
                <Text text80BO grey40>
                  {item.receivingAddress}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Collapsible collapsed={isCollapsed} align="center">
          <View>
            <View row spread>
              <Text text80 grey40>
                거래 일시
              </Text>
              <Text text80 grey40>
                {item.time}
              </Text>
            </View>

            {item.type === 'Send' ? (
              <View row spread>
                <Text text80 grey40>
                  보낸 주소
                </Text>
                <Text text80 grey40>
                  {item.sendingAddress}
                </Text>
              </View>
            ) : (
              <View row spread>
                <Text text80 grey40>
                  받은 주소
                </Text>
                <Text text80 grey40>
                  {item.receivingAddress}
                </Text>
              </View>
            )}

            <View row spread>
              <Text text80 grey40>
                수수료
              </Text>
              <Text text80 grey40>
                {item.charge}
              </Text>
            </View>
          </View>
        </Collapsible>
      </View>
    </View>
  );
};

const TokenDetail = ({ route }: TokenDetailProps) => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View center>
          <Text>Wrapped Decentraland MANA</Text>
          <Text marginV-20>Network Name</Text>
          <View marginT-20 padding-5 row>
            <Text text50>100,123.00</Text>
            <Text marginL-5 text50 grey40>
              MANA
            </Text>
          </View>
          <Text text60 blue10>
            $213,212.00
          </Text>
        </View>
        <View center row padding-20>
          <Button marginR-5 backgroundColor={Colors.black} label="Receive" />
          <Button marginL-5 backgroundColor={Colors.black} label="Send" />
        </View>
        <CollapsibleList />
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
  transaction: {
    backgroundColor: Colors.grey80,
    padding: Spacings.s5,
    borderRadius: BorderRadiuses.br50,
  },
});

export default TokenDetail;
