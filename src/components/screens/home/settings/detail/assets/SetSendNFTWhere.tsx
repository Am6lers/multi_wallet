import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  TextField,
  BorderRadiuses,
  Colors,
  Spacings,
} from 'react-native-ui-lib';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from '@constants/app';
import TL from '@translate/index';
import Clipboard from '@react-native-clipboard/clipboard';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NFTItem, NFTitems } from './SendNFT';

const AddressField = ({ item }: { item: NFTItem }) => {
  const [text, setText] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [showButton, setShowButton] = useState(true);

  const handleTextChange = (inputText: string) => {
    setText(inputText);
    setShowButton(inputText.trim() === '');
  };

  const copyToClipboard = () => {
    Clipboard.setString('hello world');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
    handleTextChange(text);
  };

  const PasteButton = () => {
    return (
      <Button
        br30
        size="medium"
        label="Paste"
        onPress={() => fetchCopiedText()}
      />
    );
  };

  const QRCodeScan = () => {
    return (
      <TouchableOpacity>
        <Icon name="qrcode-scan" size={24} />
        {/* <Icon name="line-scan" size={24} /> */}
        {/* qr code scan으로 이동 */}
      </TouchableOpacity>
    );
  };

  const NextButton = ({ item }: { item: NFTItem }) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<ParamListBase>>();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Button
          br30
          size="large"
          label="Next"
          disabled={showButton}
          onPress={() =>
            navigation.navigate('SetSendNFTAmount', { item: item })
          }
        />
      </KeyboardAvoidingView>
    );
  };

  return (
    <View>
      <View marginV-30 marginH-20 center style={styles.address}>
        <QRCodeScan />
        <TextField
          placeholder={'Wallet address'}
          onChangeText={handleTextChange}
          selectTextOnFocus={true}
          containerStyle={{
            borderRadius: BorderRadiuses.br30,
            backgroundColor: Colors.grey70,
            padding: Spacings.s3,
          }}
        />
        <PasteButton />
      </View>
      <View marginV-15>
        <Text text80 grey40 center>
          The address you entered is a contract address,{'\n'}not a personal
          wallet address.
        </Text>
      </View>
      <NextButton item={item} />
    </View>
  );
};

interface SetSendWhereProps {
  route: {
    params: {
      item: NFTItem;
    };
  };
}

const SetSendWhere = ({ route }: SetSendWhereProps) => {
  const { item } = route.params;
  return (
    <View style={styles.outline} useSafeArea>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text marginT-20 text40BO center>
            Where to send it?
          </Text>
          <AddressField item={item} />
        </View>
      </TouchableWithoutFeedback>
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
  address: {
    backgroundColor: Colors.grey70,
    borderRadius: BorderRadiuses.br30,
    padding: Spacings.s3,
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default SetSendWhere;
