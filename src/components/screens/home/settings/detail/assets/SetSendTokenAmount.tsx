import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  View,
  TextField,
  BorderRadiuses,
  Colors,
  Spacings,
  ListItem,
  Image,
} from 'react-native-ui-lib';
import { Keyboard, StyleSheet } from 'react-native';
import Constants from '@constants/app';
import TL from '@translate/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import Keypad from '@components/atoms/Keypad';
import { NFTItem } from '../NFTItem';
import { TokenItem } from '../TokenItem';

interface SetQuantityProps {
  quantity: string;
  setQuantity: React.Dispatch<React.SetStateAction<string>>;
}

type QuantityFieldProps = {
  text: string;
  onChangeText: (text: string) => void;
};

const SearchField = ({ text, onChangeText }: QuantityFieldProps) => {
  return (
    <View>
      <View marginV-30 marginH-20 center style={styles.address}>
        <View>
          <TextField
            placeholder={'Please enter a quantity'}
            onChangeText={onChangeText}
            selectTextOnFocus={true}
            containerStyle={{
              borderRadius: BorderRadiuses.br30,
              backgroundColor: Colors.grey70,
              padding: Spacings.s3,
            }}
            value={text}
          />
        </View>
        <Button br30 size="medium" label="Max" />
      </View>
    </View>
  );
};

interface SetSendTokenAmountProps {
  route: {
    params: {
      item: TokenItem;
    };
  };
}

const NextButton = ({ item }: { item: TokenItem }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View>
      <Button
        br30
        marginV-20
        size="large"
        label="Next"
        onPress={() => navigation.navigate('SetSendTokenCharge', { item: item })}
      />
    </View>
  );
};

const RenderKeypad = ({ quantity, setQuantity }: SetQuantityProps) => {
  const handleSetNumbers = (numbers: number[]) => {
    if (numbers.length > 0) {
      const newQuantity = numbers.join(''); // 숫자 배열을 문자열로 변환
      setQuantity(newQuantity); // 문자열을 상태로 업데이트
    } else {
      setQuantity(''); // 숫자가 없을 경우 상태를 초기화
    }
  };

  return (
    <View style={styles.button}>
      <Keypad setNumbers={handleSetNumbers} />
    </View>
  );
};

const AssetInfo = ({ item }: { item: TokenItem }) => {
  return (
    <ListItem style={styles.asset}>
      <ListItem.Part left>
        <View>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
            }}
            borderRadius={BorderRadiuses.br100}
            style={{ maxWidth: 50, maxHeight: 50 }}
          />
        </View>
      </ListItem.Part>
      <ListItem.Part middle column>
        <ListItem.Part>
          <View paddingL-20>
            <Text text70BO>Collection Name</Text>
            <Text text70BO>NFT Name {item.title}</Text>
          </View>
        </ListItem.Part>
      </ListItem.Part>
    </ListItem>
  );
};

const SetSendTokenAmount = ({ route }: SetSendTokenAmountProps) => {
  const [quantity, setQuantity] = useState('');
  const { item } = route.params;
  const handleQuantityChange = (newQuantity: string) => {
    setQuantity(newQuantity);
  };

  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <Text marginT-20 text40BO center>
          How much to send?
        </Text>
        <SearchField text={quantity} onChangeText={handleQuantityChange} />
        <Text marginT-50 text80 grey40 center>
          Quantity excluding estimated fees.
        </Text>
        {/* <Text>Excludes estimated fees.</Text> */}
        <AssetInfo item={item} />
        <NextButton item={item} />
        <RenderKeypad quantity={quantity} setQuantity={setQuantity} />
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
  button: {
    height: Constants.WINDOW_HEIGHT / 12,
  },
  shadow: {
    borderRadius: BorderRadiuses.br60,
    width: '100%',
  },
  flatlist: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadiuses.br60,
  },
  asset: {
    backgroundColor: Colors.grey80,
    borderRadius: BorderRadiuses.br50,
    padding: Spacings.s3,
  },
});

export default SetSendTokenAmount;
