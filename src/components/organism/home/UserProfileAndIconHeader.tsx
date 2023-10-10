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
import { useRecoilValue } from 'recoil';
import { superMasterName } from '@store/atoms';
import EvilIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet } from 'react-native';

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

const UserProfileAndIconHeader = () => {
  const masterName = useRecoilValue(superMasterName);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 25,
      }}
    >
      <View style={styles.row}>
        <ProfileImage></ProfileImage>
        <Text
          text65BO
          style={{
            fontSize: 22,
            paddingLeft: 5,
            paddingTop: 9,
            color: 'gray',
            opacity: 0.7,
          }}
        >
          {masterName}
        </Text>
      </View>
      <View>
        <View style={styles.row}>
          <EvilIcon name="refresh" size={24} style={styles.icon} />
          <Icon name="line-scan" size={24} style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

export default UserProfileAndIconHeader;
