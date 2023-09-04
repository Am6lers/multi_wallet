import React from 'react';
import { ListItem, Text } from 'react-native-ui-lib';

const TokenItem = () => {
  return (
    <ListItem onPress={() => console.log('pressed')}>
      <Text grey10 text60 marginL-10>
        The item
      </Text>
    </ListItem>
  );
};

export default TokenItem;
