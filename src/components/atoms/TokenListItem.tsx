import React from 'react';
import { StyleSheet } from 'react-native';
import {
  BorderRadiuses,
  Image,
  ListItem,
  Text,
  View,
} from 'react-native-ui-lib';
import Colors from '@constants/colors';
import { BalanceMap } from 'eth-balance-checker/lib/common';
import Constants from '@constants/app';
import { MoralisToken } from '@scripts/controllers/accountAsset';

interface TokenData {
  token: MoralisToken;
  balance: BalanceMap;
  price: string;
}

const TokenListItem = ({ item, index }: { item: TokenData; index: number }) => {
  console.log('moralis token list item:', item);
  return (
    <ListItem
      activeBackgroundColor={Colors.Gray}
      activeOpacity={0.3}
      height={77}
      onPress={() => {}}
      style={styles.container}
    >
      <ListItem.Part left>
        <Image source={{ uri: item.token.tokenLogo }} style={styles.image} />
      </ListItem.Part>
      <ListItem.Part middle column containerStyle={styles.border}>
        <ListItem.Part>
          <Text grey10 text70 style={styles.flex} numberOfLines={1}>
            {item.token.tokenName}
          </Text>
          <Text grey10 text70>
            {item.balance}
          </Text>
        </ListItem.Part>
        <ListItem.Part>
          <Text style={styles.flex} text90 grey40 numberOfLines={1}>
            {item.token.tokenSymbol}
          </Text>
          <Text text90 color={Colors.Dark} numberOfLines={1}>
            {`$ ${item.price}`}
          </Text>
        </ListItem.Part>
      </ListItem.Part>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Constants.PAGE_M2,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: BorderRadiuses.br20,
    marginRight: Constants.PAGE_M2,
  },
  border: {
    borderColor: Colors.Gray,
  },
  flex: {
    flex: 1,
  },
});

export default TokenListItem;
