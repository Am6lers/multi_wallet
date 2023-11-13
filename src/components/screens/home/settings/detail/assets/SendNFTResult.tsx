import React from 'react';
import {
  BorderRadiuses,
  Button,
  Image,
  Text,
  View,
  Colors,
  Spacings,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import { NFTItem } from './SendNFT';
import { StyleSheet } from 'react-native';

interface SetSendNFTResultProps {
  route: {
    params: {
      item: NFTItem;
    };
  };
}

const AssetDisplay = ({ item }: { item: NFTItem }) => {
  return (
    <View>
      <View centerH padding-20>
        <Text>Etherium Network</Text>
        <View marginT-10 row>
          <Image
            borderRadius={BorderRadiuses.br100}
            source={{ uri: item.image }}
            style={{ width: 100, height: 100 }}
          />
        </View>

        <Text text50>{item.name}</Text>
        <Text text70BO grey40>
          {item.standard}
        </Text>
      </View>
    </View>
  );
};

const PaidCharge = () => {
  return (
    <View marginB-20 style={styles.charge}>
      <Text text70BO marginB-10 >
        Paid Charge
      </Text>
      <View row>
        <View>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/bifrost-platform/AssetInfo/master/Assets/ethereum/coin/coinImage.png',
            }}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <View row center>
          <Text text70BO>0.01ETH</Text>
          <Text text80 grey40>
            $0.00
          </Text>
        </View>
      </View>
    </View>
  );
};

const CheckButton = () => {
  return (
    <View row>
      <Button  br40 size="large" label="transactions" disabled={true} />
      <Button br40 size="large" label="check" />
    </View>
  );
};

const SendNFTResult = ({ route }: SetSendNFTResultProps) => {
  const { item } = route.params;
  return (
    <View style={styles.outline} useSafeArea>
      <View spread style={styles.container}>
        <View>
          <Text center marginT-30 text40BO>
            Send Success
          </Text>
          {/* Send Success / Send Failed / Cancel Send */}
          <AssetDisplay item={item} />
        </View>
        <View marginB-20>
          <PaidCharge />
          <CheckButton />
        </View>
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
  charge: {
    backgroundColor: Colors.grey80,
    borderRadius: BorderRadiuses.br50,
    justifyContent: 'space-between',
    padding: Spacings.s3,
  },
});

export default SendNFTResult;
