import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type WalletItem = {
  text?: string;
  icon?: string;
  action?: () => void;
};

const SendAssetList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const assets = [
    {
      text: 'Token assets',
      icon: '',
      action: () => navigation.navigate('TokenList'),
    },
    {
      text: 'NFT assets',
      icon: '',
      action: () => navigation.navigate('NFTList'),
    },
  ];
  const renderItem: ListRenderItem<WalletItem> = ({ item }) => {
    if (!item) return null;
    return (
      <View marginV-5 padding-10>
        <Text text70BO onPress={item.action}>
          {item.icon}
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={assets}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={renderItem}
        // stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const ManageWallet = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <SendAssetList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
});

export default ManageWallet;
