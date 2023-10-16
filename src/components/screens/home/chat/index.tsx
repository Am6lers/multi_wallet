import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import {
  View,
  Text,
  Card,
  Image,
  Avatar,
  AvatarHelper,
  AvatarProps,
  ListItem,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import Engine from '@core/engine';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/Ionicons';
import { Addresses, DisplayKeyring } from '@scripts/controllers/keyring';
import { useRecoilValue } from 'recoil';
import { superMasterName } from '@store/atoms';
import UserProfileAndIconHeader from '@components/organism/home/UserProfileAndIconHeader';
import Web3Personal from 'web3-shh';
import engine from '@core/engine';
import Web3 from 'web3';
import {
  defaultPubsubTopic,
  newNode,
  start,
  isStarted,
  stop,
  peerID,
  relayEnoughPeers,
  listenAddresses,
  connect,
  peerCnt,
  peers,
  relayPublish,
  relayUnsubscribe,
  relaySubscribe,
  WakuMessage,
  onMessage,
  StoreQuery,
  storeQuery,
  Config,
  FilterSubscription,
  ContentFilter,
  filterSubscribe,
  dnsDiscovery,
} from '@waku/react-native';

const Chat = () => {
  useEffect(() => {
    (async () => {
      const nodeStarted = await isStarted();
      if (!nodeStarted) {
        await newNode(null);
        await start();
      }
      console.log('The node ID:', await peerID());
      await relaySubscribe();
      onMessage(event => {
        if (
          event.wakuMessage.contentTopic !==
          '0x191ee2600fc9f0fbf5ca7236e285b19f123dcec7'
        )
          return;
        console.log(
          'Message received: ' +
            event.wakuMessage.timestamp +
            ' - payload :[' +
            new TextDecoder().decode(event.wakuMessage.payload) +
            ']',
        );
        console.log('Message received: ', event);
      });
      try {
        await connect(
          '/dns4/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/30303/p2p/16Uiu2HAkvWiyFsgRhuJEb9JfjYxEkoHLgnUQmr1N5mKWnYjxYRVm',
          5000,
        );
      } catch (err) {
        console.log('Could not connect to peers');
      }

      try {
        await connect(
          '/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/30303/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ',
          5000,
        );
      } catch (err) {
        console.log('Could not connect to peers');
      }
      let msg = new WakuMessage();
      msg.contentTopic = '0x191ee2600fc9f0fbf5ca7236e285b19f123dcec7';
      msg.payload = new TextEncoder().encode('Hi BoB');
      msg.timestamp = new Date();
      msg.version = 0;

      let messageID = await relayPublish(msg);
    })();
  }, []);
  return (
    <View style={styles.container} useSafeArea>
      <View
        style={{
          flexDirection: 'column',
          paddingHorizontal: 20,
        }}
      >
        <UserProfileAndIconHeader></UserProfileAndIconHeader>
        <ChatList></ChatList>
      </View>
    </View>
  );
};

const ProfileImage = () => {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        backgroundColor: 'gray',
        borderRadius: 15,
      }}
    ></View>
  );
};

const ChatList = () => {
  return (
    <View style={styles.friendsList}>
      <ScrollView>
        <FriendsInfoCard></FriendsInfoCard>
      </ScrollView>
    </View>
  );
};

const FriendsInfoCard = () => {
  const masterName = useRecoilValue(superMasterName);
  const [accounts, setAccounts] = React.useState<Addresses[]>([]);

  useEffect(() => {
    getAccountsInKeyrings();
  }, []);

  const getAccountsInKeyrings = useCallback(async () => {
    const { KeyringController } = Engine.context;
    const keyrings = KeyringController.getAllKeyrings();
    const accounts = keyrings.map(
      (keyring: DisplayKeyring) => keyring.accounts,
    );
    setAccounts(accounts);
  }, [accounts]);

  const FriendAccounts = React.memo(() => {
    return (
      <View marginB>
        {accounts.map(account => {
          // const { PreferencesController } = Engine.context;
          const evmAccount = useMemo(
            () =>
              `EVM: ${account?.evm?.slice(0, 5)}...${account?.evm?.slice(-5)}`,
            [],
          );
          const DIDAccount = useMemo(
            () =>
              `DID:EVM:${account?.evm?.slice(0, 5)}...${account?.evm?.slice(
                -5,
              )}`,
            [],
          );
          return (
            <View>
              <Text style={{ fontSize: 10, color: 'gray' }}>{evmAccount}</Text>
              <Text style={{ fontSize: 10, color: 'gray' }}>{DIDAccount}</Text>
            </View>
          );
        })}
      </View>
    );
  });

  const RoomCard = ({
    profileURL,
    roomName,
  }: {
    profileURL: string;
    roomName: string;
  }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* 아이콘 */}
        <Avatar
          source={{
            uri: profileURL,
          }}
          size={70}
        />
        {/* 닉네임, 주소 정보 */}
        <View style={{ paddingLeft: 15 }}>
          {/* 여기에 주소를 적기 */}
          <Text
            text65BO
            style={{
              fontSize: 20,
            }}
          >
            {roomName}
          </Text>
          <FriendAccounts />
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '5%',
          marginTop: '3%',
        }}
      >
        <Text text65BO style={{ fontSize: 18 }}>
          {'채팅방'}
        </Text>
        <Icon name="dots-vertical" size={36} style={{ opacity: 0.5 }}></Icon>
      </View>

      <View>
        <Text
          text65BO
          style={{ fontSize: 14, opacity: 0.6 }}
          onPress={() => {
            console.log('Clicked!!');
          }}
        >
          {'지갑 멀티 프로필'}
        </Text>
      </View>
      <ListItem onPress={() => console.log('눌림1')} marginB-20>
        <RoomCard
          profileURL={
            'https://i.namu.wiki/i/KHZxgx6dilwr4Z7uu6wSPoVlf5aIb6rq6qIOBV2LYBYdN9cWFaLlvkggojNNTD6mrwtGxS_lTPh4Woge2hzuZQ.webp'
          }
          roomName={'Room 1'}
        />
      </ListItem>
      <ListItem onPress={() => console.log('눌림2')}>
        <RoomCard
          profileURL={
            'https://i.namu.wiki/i/nxh9FVo7GMPqZLXQkJsfeNksce7uSHKlCbnA8nBCQtIdcgUmRqrMR8-4oMA3Q5qYdeF5v4g347okfJU0yFgdvhMjqHQSX6IFKkd4hc_J_I6_NNY4oXQYdzfTNyZuiQoDmDgbajLh6QrKNQURazouiA.webp'
          }
          roomName={'Room 2'}
        />
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: Constants.PAGE_M1,
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    flex: 1,
  },
  cardList: {
    marginBottom: 16,
  },
  friendsList: {
    backgroundColor: 'white',
    height: 650,
    width: 340,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  friend: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

export default Chat;
