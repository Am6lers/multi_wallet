import { Text, View, Checkbox, Button } from 'react-native-ui-lib';
import { ScrollView, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Header from '@components/atoms/Header';
import WalletIcon from '@assets/icons/wallet.svg';
import Constants from '@constants/app';
import { useState } from 'react';
import LottieView from 'lottie-react-native';
import { LOTTIE_CONFETTI } from '@assets/lottie/roots';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const BackupFin = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const navigateToWallet = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainStackNavigator' }],
    });
  };
  return (
    <View style={styles.outline} useSafeArea>
      <Header title={TL.t('backup.header')} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cards}>
          <View>
            <Text marginT-24 text50BL center>
              {TL.t('backup.done.notification')}
            </Text>
            <View>
              <WalletIcon style={styles.walletIcon} />
              <LottieView
                source={LOTTIE_CONFETTI}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
            <Text marginT-33 marginB-40 text70H>
              {TL.t('backup.done.notificationDetail')}
            </Text>
          </View>
        </View>
        <View>
          <Button
            marginT-24
            label={TL.t('backup.done.complete')}
            backgroundColor={Colors.Navy}
            size={Button.sizes.large}
            borderRadius={15}
            enableShadow={true}
            style={styles.button}
            disabled={false}
            onPress={navigateToWallet}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BackupFin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Light0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lottie: {
    minWidth: 350,
    minHeight: 350,
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
  },
  outline: {
    backgroundColor: Colors.Light0,
    flex: 1,
  },
  walletIcon: {
    position: 'relative',
    zIndex: 3,
    elevation: 3,
    justifyContent: 'center',
  },
  cards: {
    paddingHorizontal: Constants.PAGE_M1,
    justifyContent: 'center',
  },
  cardBackground: {
    zIndex: 1,
    elevation: 1,
    backgroundColor: Colors.White,
    width: 327,
    height: 130,
    borderRadius: 24,
  },
  cardTextBold: {
    zIndex: 2,
    elevation: 2,
    paddingTop: 16,
    paddingLeft: 16,
  },
  cardTextFaint: {
    zIndex: 2,
    elevation: 2,
    paddingLeft: 16,
    paddingTop: 16,
    color: Colors.Gray,
  },
  textAndButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkbox: {
    zIndex: 2,
    elevation: 2,
  },
  button: {
    marginBottom: 30,
    width: 340,
  },
  clipboardButton: {
    borderRadius: 12,
  },
});
