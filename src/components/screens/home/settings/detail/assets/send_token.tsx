import React, { FC, useState } from 'react';
import { Button, Text, View, TextField, BorderRadiuses, Colors, Spacings, Assets } from 'react-native-ui-lib';
import { Keyboard, Pressable, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from '@constants/app';
import TL from '@translate/index';  
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types/navigation'
import { useNavigation } from '@react-navigation/native';


type SendDetailNavigationProp = NativeStackNavigationProp<RootStackParamList['APP']['Send'], 'SendDetail'>;

type Props = {
  navigation: SendDetailNavigationProp
}

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
          <TouchableOpacity>
            <Icon name="line-scan" size={24} marginL-10/>
          </TouchableOpacity>
          <TextField
            placeholder={'Wallet address'}
            onChangeText={text => setText(text)}
            selectTextOnFocus={true}
            containerStyle={
              {
                borderRadius: BorderRadiuses.br30, 
                backgroundColor: Colors.grey70,
                padding: Spacings.s3
              }
            }
            // inputMode='text'
          />
          <Button br30
            size='medium'
            label="Paste"
            onPress = {() => fetchCopiedText()}
          />
      </View>
      <View marginV-15>
        <Text text80 grey40 center>The address you entered is a contract address,{'\n'}not a personal wallet address.</Text>
      </View>
      
    </View>
  )
}

const NextButton : FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Button br30
        size='large'
        label="Next"
        onPress={() => navigation.navigate('SendDetail')}
      />
    </View>
  )
}

const SendToken = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
     
          <Text text40BO center>Where to send it?</Text>
          <SearchField />
          <NextButton navigation={useNavigation()} />
          
      </View>
      </TouchableWithoutFeedback>
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

export default SendToken;

