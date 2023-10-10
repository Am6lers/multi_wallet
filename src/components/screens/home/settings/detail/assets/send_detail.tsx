import React, { useState } from 'react';
import { Button, Text, View, TextField, BorderRadiuses, Colors, Spacings, Assets } from 'react-native-ui-lib';
import { Keyboard, Pressable, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from '@constants/app';
import TL from '@translate/index';  
import Clipboard from '@react-native-clipboard/clipboard';
import Keypad from '@components/atoms/Keypad';

const SearchField = () => {
  const [text, setText] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [showButton, setShowButton] = useState(false);

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };
  
  return (
    <View>
      <View marginV-30 marginH-20 center style={styles.address}>
          <TextField
            placeholder={'Please enter a quantity'}
            onChangeText={text => setText(text)}
            selectTextOnFocus={true}
            containerStyle={
              {
                borderRadius: BorderRadiuses.br30, 
                backgroundColor: Colors.grey70,
                padding: Spacings.s3
              }
            }
          />
          <Button br30
            size='medium'
            label="Max"
            
          />
      </View>
    </View>
  )
}

const NextButton = () => {
  return (
    <View>
      <Text text80 grey40 center>Quantity excluding estimated fees.</Text>
      {/* <Text>Excludes estimated fees.</Text> */}
      <Button br30 marginV-20
          size='large'
          label="Next"
      />
    </View>
  )
}

const SendDetail = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>     
          <Text text40BO center>How much to send?</Text>
          <SearchField />         
          <NextButton />
          <Keypad setNumbers={()=>{}}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
  address: {
    backgroundColor: Colors.grey70,
    borderRadius: BorderRadiuses.br30,
    padding: Spacings.s3,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  paste: {
    backgroundColor: Colors.blue50,
    borderRadius: BorderRadiuses.br30,
    padding: Spacings.s2,
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});

export default SendDetail;

