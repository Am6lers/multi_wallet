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

const Chat = () => {
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

// const UserProfileAndIconHeader = () => {
//   const masterName = useRecoilValue(superMasterName);
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingBottom: 25,
//       }}
//     >
//       <View style={styles.row}>
//         <ProfileImage></ProfileImage>
//         <Text
//           text65BO
//           style={{
//             fontSize: 22,
//             paddingLeft: 5,
//             paddingTop: 9,
//             color: 'gray',
//             opacity: 0.7,
//           }}
//         >
//           {masterName}
//         </Text>
//       </View>
//       <View>
//         <View style={styles.row}>
//           <EvilIcon name="refresh" size={24} style={styles.icon} />
//           <Icon name="line-scan" size={24} style={styles.icon} />
//         </View>
//       </View>
//     </View>
//   );
// };

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
