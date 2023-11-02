import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  Image,
  BorderRadiuses,
  Colors,
  Spacings,
  Assets,
  Modal,
  ListItem,
} from 'react-native-ui-lib';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Constants from '@constants/app';
import TL from '@translate/index';
import { TokenItem } from './SendToken';

interface EstimatedFeesProps {
  isSend: boolean;
  setIsSend: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SetSendTokenChargeProps {
  route: {
    params: {
      item: TokenItem;
    };
  };
}

const SendButton = ({ isSend, setIsSend }: EstimatedFeesProps) => {
  return (
    <View>
      {!isSend && (
        <Button
          br30
          marginV-20
          size="large"
          label="Send"
          onPress={() => setIsSend(true)}
        />
      )}
      {isSend && (
        <View row spread>
          <Button br40 marginV-20 size="large" label="Cancel" disabled={true} />
          <Button
            br40
            marginV-20
            size="large"
            label="Go to Wallet"
            onPress={() => setIsSend(false)}
          />
        </View>
      )}
    </View>
  );
};

const AssetDisplay = ({
  item,
  isSend,
  setIsSend,
}: EstimatedFeesProps & { item: TokenItem }) => {
  return (
    <View>
      {isSend && (
        <ActivityIndicator
          size="large"
          color={Colors.purple20}
        ></ActivityIndicator>
      )}

      <View centerH padding-20>
        <Text>Etherium Network</Text>
        <View marginT-10 row>
          <Image
            borderRadius={BorderRadiuses.br100}
            source={{ uri: item.image }}
            style={{ maxWidth: 100, maxHeight: 100 }}
          />
        </View>

        <Text text50>{item.title}</Text>
        <Text text70BO grey40>
          {item.value}
        </Text>
      </View>
    </View>
  );
};

const Address = () => {
  return (
    <View marginT-100>
      <Text text70BO marginB-10>
        address
      </Text>
      <View padding-10 style={styles.address}>
        <Text grey40 text70BO>
          0xefa4856393e4d74361ee61e0145446237b1af38e
        </Text>
      </View>
    </View>
  );
};

const ChargeItem = () => {
  return (
    <ListItem style={styles.charge}>
      <ListItem.Part left>
        <View>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
            }}
            style={{ maxWidth: 30, maxHeight: 30 }}
          />
        </View>
      </ListItem.Part>
      <ListItem.Part middle column>
        <ListItem.Part>
          <View>
            <Text>$00.00</Text>
            <Text>0.000ETH</Text>
          </View>
          <View>
            <Text>Speed</Text>
          </View>
        </ListItem.Part>
      </ListItem.Part>
    </ListItem>
  );
};

const SetFeesModal = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Modal
        style={styles.modal}
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(!visible)}
        presentationStyle="formSheet"
      >
        <View style={{ maxHeight: '50%' }}>
          <View padding-30 row spread>
            <Text text50BO>Set up fees</Text>
            <Button
              iconSource={Assets.icons.x}
              color={Colors.black}
              backgroundColor={Colors.white}
              onPress={() => setVisible(!visible)}
            />
          </View>
          <View padding-10>
            <ChargeItem />
          </View>
          <View padding-10>
            <ChargeItem />
          </View>
          <View padding-10>
            <ChargeItem />
          </View>
        </View>
      </Modal>
      <View>
        <Button
          size="small"
          color={Colors.blue30}
          backgroundColor={Colors.white}
          label="Edit"
          onPress={() => setVisible(true)}
        />
      </View>
    </View>
  );
};

const EstimatedFees = ({ isSend, setIsSend }: EstimatedFeesProps) => {
  return (
    <View marginT-20>
      {!isSend && (
        <View>
          <Text text70BO marginB-10>
            Estimated fees
          </Text>
          <View row spread style={styles.charge}>
            <View>
              <ListItem>
                <ListItem.Part left>
                  <View>
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
                      }}
                      style={{ maxWidth: 30, maxHeight: 30 }}
                    />
                  </View>
                </ListItem.Part>
                <ListItem.Part middle column>
                  <ListItem.Part>
                    <View>
                      <Text>$00.00</Text>
                      <Text>0.000ETH</Text>
                    </View>
                    <View>
                      <SetFeesModal />
                    </View>
                  </ListItem.Part>
                </ListItem.Part>
              </ListItem>
            </View>
          </View>
        </View>
      )}
      {isSend && (
        <View center>
          <Text grey40 text70BO>
            Want to check transaction status directly?
          </Text>
          <Text blue30 text70L>
            Check directly with the scanner ⌕
          </Text>
        </View>
      )}
    </View>
  );
};

const SetSendTokenCharge = ({ route }: SetSendTokenChargeProps) => {
  const { item } = route.params;

  const [isSend, setIsSend] = useState(false);

  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <Text margin-20 text40BO center>
          Can I send it as is?
        </Text>
        <AssetDisplay item={item} isSend={isSend} setIsSend={setIsSend} />
        <Address />
        <EstimatedFees isSend={isSend} setIsSend={setIsSend} />
        <SendButton isSend={isSend} setIsSend={setIsSend} />
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
    backgroundColor: Colors.grey80,
    borderRadius: BorderRadiuses.br50,
    padding: Spacings.s3,
  },
  charge: {
    backgroundColor: Colors.grey80,
    borderRadius: BorderRadiuses.br50,
    padding: Spacings.s3,
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
  shadow: {
    borderRadius: BorderRadiuses.br30,
    width: '100%',
  },
  item: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadiuses.br30,
    padding: Spacings.s3,
  },
  fee: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 200,
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

export default SetSendTokenCharge;
