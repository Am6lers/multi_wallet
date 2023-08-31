import React, { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import Constants from '@constants/app';
import { Card, Text, View } from 'react-native-ui-lib';
import Colors from '@constants/colors';
import { Addresses } from '@scripts/controllers/keyring';
import engine from '@core/engine';
import { Shadow } from 'react-native-shadow-2';
import { CIPHER_LOGO } from '@assets/images/roots';
import LottieView from 'lottie-react-native';
import { LOTTIE_CARD_BG_2 } from '@assets/lottie/roots';

const WalletCard = ({ account }: { account: Addresses }) => {
  const { PreferencesController } = engine.context;
  const evmAccount = useMemo(
    () => `EVM: ${account?.evm?.slice(0, 5)}...${account?.evm?.slice(-5)}`,
    [],
  );
  const btcAccount = useMemo(
    () => `BTC: ${account?.btc?.slice(0, 5)}...${account?.btc?.slice(-5)}`,
    [],
  );
  const accountName = useMemo(
    () =>
      PreferencesController.getAccountIdentity(
        `${account?.evm}/${account?.btc}`,
      )?.name,
    [],
  );

  return (
    <Shadow offset={[0, 4]} distance={5} style={styles.shadow}>
      <View style={styles.card}>
        <Text text65BO>{accountName}</Text>
        <Text text90BL color={Colors.Gray}>
          {evmAccount}
        </Text>
        <Text text90BL color={Colors.Gray}>
          {btcAccount}
        </Text>
        <Image style={{ width: 50, height: 50 }} source={CIPHER_LOGO} />
        <LottieView
          source={LOTTIE_CARD_BG_2}
          autoPlay
          style={styles.lottie}
          resizeMode="contain"
        />
      </View>
    </Shadow>
  );
};

export default WalletCard;

const styles = StyleSheet.create({
  card: {
    minHeight: Constants.WINDOW_HEIGHT / 5,
    width: '100%',
    backgroundColor: Colors.White,
    padding: 20,
    borderRadius: 20,
  },
  shadow: {
    borderRadius: 20,
    width: '100%',
  },
  lottie: {
    minHeight: Constants.SCREEN_HEIGHT / 2.5,
    minWidth: '100%',
    position: 'absolute',
    maxHeight: Constants.WINDOW_HEIGHT / 5,
    alignSelf: 'center',
    zIndex: -1,
  },
});