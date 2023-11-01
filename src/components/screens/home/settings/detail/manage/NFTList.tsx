import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  View,
  Colors,
  Spacings,
  BorderRadiuses,
  GridList,
  Image,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NFTItem, items } from '../NFTItem';

const NFTGridView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const ItemPress = (item: NFTItem) => {
    navigation.navigate('NFTDetail', { item: item });
  };
  return (
    <GridList
      data={items}
      renderItem={({ item, index }) => (
        <View marginV-20 key={`${item.title}+${index}`}>
          <TouchableOpacity onPress={() => ItemPress(item)}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
            <Text text70BO>{item.title}</Text>
          </TouchableOpacity>
        </View>
      )}
      numColumns={2}
      itemSpacing={Spacings.s3}
      listPadding={Spacings.s5}
    />
  );
};

const NFTList = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View marginT-10>
          <Text text40BO>Collection Name</Text>
        </View>
        <NFTGridView />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
});

export default NFTList;
