import React, { useEffect, useState } from 'react';
import { ListItem, Text, View } from 'react-native-ui-lib';
import axiosClient from '@utils/axios';
import { Image, StyleSheet } from 'react-native';
import Constants from '@constants/app';
import { FlatList } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface CRDData {
  image: string;
  type: string;
  name: string;
  birth: string;
  id: string;
}

const CredentialList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [credentialSubject, setCredentialSubject] = useState<CRDData[]>([]);
  const ipfsList = [
    'https://ipfs.io/ipfs/QmVHM9h74RhWpXr811bUJnBa1KjnXKATmMRC7kd5YAhfR6',
    'https://ipfs.io/ipfs/QmexZsXw6UYM1m3grNQaQAHtqCPn1U1hWCVZCz7T9mm7uY',
    'https://ipfs.io/ipfs/QmQaiwiyLDdQLyFXBsCTMK9A94nMFEh3T7yT6hhQgkRkWY',
  ];

  useEffect(() => {
    getCredentialsData();
  }, []);

  const getCredentialsData = async () => {
    try {
      const resultData = await Promise.all(
        ipfsList.map(async ipfs => {
          const result = await axiosClient.get(ipfs);
          const responseData = result?.data?.credentialSubject;
          if (responseData) {
            return {
              image: responseData.image,
              type: responseData.degree.type,
              name: responseData.degree.name,
              birth: responseData.degree.birth,
              id: responseData.id,
            };
          }
        }),
      );
      setCredentialSubject([...resultData]);
    } catch (e) {
      console.log('e', e);
    }
  };

  const moveToDetail = (item: CRDData) => {
    navigation.navigate('CredentialDetail', { CRDData: item });
  };

  const renderItem = ({ item }: { item: CRDData }) => {
    return (
      <View style={styles.item}>
        <ListItem
          style={styles.itemContainer}
          onPress={() => moveToDetail(item)}
        >
          <Image
            source={{ uri: `https://${item.image}` }}
            style={styles.image}
          />
          <Text grey10 text70L marginL-10>
            {item.name || 'unknown'}
          </Text>
        </ListItem>
      </View>
    );
  };
  return (
    <FlatList
      data={credentialSubject}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.name}-${index}`}
    />
  );
};

export default CredentialList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: '100%',
    padding: 10,
  },
  image: {
    width: Constants.WINDOW_WIDTH / 10,
    height: Constants.WINDOW_WIDTH / 10,
    marginRight: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
  },
  item: {
    marginHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
});
