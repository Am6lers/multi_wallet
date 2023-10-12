import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Card, Carousel, Text, View } from 'react-native-ui-lib';
import { ScrollView, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from '@constants/app';
import Engine from '@core/engine';
import { DEFAULT_TOKEN } from '@constants/asset';
import Header from '@components/organism/home/Header';
import MMKVStorage from '@utils/storage/mmkvStorage';
import SecureStorage from '@utils/storage/SecureStorage';
import { Addresses, DisplayKeyring } from '@scripts/controllers/keyring';
import WalletCard from '@components/organism/home/WalletCard';
import AssetView from './AssetView';
import TokenList from '@components/organism/home/TokenListCard';
import { moralisApiUrl } from '@scripts/controllers/accountAsset/lib/apiOptions';
import { MoralisClient } from '@scripts/controllers/accountAsset';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import MakeWalletView from './makeNewWallet/MakeWalletView';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

const Wallet = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { KeyringController } = Engine.context;
  const [accounts, setAccounts] = React.useState<Addresses[]>([]);

  useEffect(() => {
    getAccountsInKeyrings();
  }, []);

  const getAccountsInKeyrings = useCallback(async () => {
    const keyrings = KeyringController.getAllKeyrings();
    const accounts = keyrings.map(
      (keyring: DisplayKeyring) => keyring.accounts,
    );
    setAccounts(accounts);
  }, [accounts]);

  const RenderWalletCard = React.memo(() => {
    return (
      <View marginB style={styles.cardList}>
        {accounts.map(account => {
          return <WalletCard key={`${account}`} account={account} />;
        })}
      </View>
    );
  });

  return (
    <ScrollView>
      <View style={styles.outline} useSafeArea>
        <View style={styles.container}>
          <Header />
          <RenderWalletCard />
          <AssetView />
          <TokenList />
          {/* move to MakeWalletView */}
          <Button
            label="Make Wallet"
            backgroundColor={Colors.Navy}
            onPress={() => {
              // navigation.navigate('MakeWalletView');
              navigation.navigate('MakeNewWallet');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
  cardList: {
    marginBottom: 16,
  },
});

export default Wallet;
