import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  View,
  Colors,
  Spacings,
  GridList,
  Image,
  ListItem,
  BorderRadiuses,
  Modifiers,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TokenItem, tokens } from '../TokenItem';

const TokenListView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const ItemPress = (item: TokenItem) => {
    navigation.navigate('TokenDetail', { item: item });
  };

  return (
    <GridList
      data={tokens}
      renderItem={({ item, index }) => (
        <ListItem
          activeBackgroundColor={Colors.Gray}
          activeOpacity={0.3}
          height={70}
          onPress={() => ItemPress(item)}
          style={styles.container}
        >
          <ListItem.Part left>
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ maxWidth: 30, maxHeight: 30 }}
              />
            </View>
          </ListItem.Part>
          <ListItem.Part middle column>
            <ListItem.Part containerStyle={{ paddingVertical: Spacings.s5 }}>
              <View>
                <Text dark text80BO>
                  {item.title}
                </Text>
              </View>
              <View>
                <Text text80BO>{item.value}</Text>
                <Text text90 grey40>
                  {item.amount}
                </Text>
              </View>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      )}
      numColumns={1}
      itemSpacing={Spacings.s3}
      listPadding={Spacings.s5}
    />
  );
};

const TokenList = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <TokenListView />
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

export default TokenList;
