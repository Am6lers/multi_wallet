import React, { useCallback, useEffect, useMemo } from 'react';
import { Card, Carousel, Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
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
import TokenList from '@components/organism/home/TokenList';
import NftList from '@components/organism/home/NftList';
import AssetView from './AssetView';

const Tab = createBottomTabNavigator();

const Wallet = () => {
  const [accounts, setAccounts] = React.useState<Addresses[]>([]);

  useEffect(() => {
    getAccountsInKeyrings();
  }, []);

  const getAccountsInKeyrings = useCallback(async () => {
    const { KeyringController } = Engine.context;
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
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <Header />
        <RenderWalletCard />
        <AssetView />
        {/* <TokenList />
        <NftList /> */}
      </View>
    </View>
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
