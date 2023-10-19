import { Text, View, Checkbox, Button } from 'react-native-ui-lib';
import { ScrollView, StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Header from '@components/atoms/Header';
import BackupIcon from '@assets/icons/Backup.svg';
import Constants from '@constants/app';
import { useState } from 'react';
import TL from '@translate/index';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ProvideWalletRecovery = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const navigateToBackupFin = () => {
    navigation.navigate('BackupFin');
  };

  return (
    <View style={styles.outline} useSafeArea>
      <Header title={TL.t('backup.header')} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.cards}>
            <View style={styles.backupIcon}>
              <Text marginT-24 text50BL center>
                {TL.t('backup.backupSeed.notification')}
              </Text>
              <Text marginT-24 marginB-40 text80H>
                {TL.t('backup.backupSeed.notificationDetail')}
              </Text>
            </View>
            <View style={styles.cardBackground}>
              <View style={styles.textAndButton}>
                <Text text60M style={styles.cardTextBold}>
                  {TL.t('backup.backupSeed.recovery')}
                </Text>
                <Button
                  marginT-16
                  marginR-16
                  backgroundColor="#5F5BE2"
                  label={TL.t('backup.backupSeed.copy')}
                  labelStyle={{ fontWeight: '600' }}
                  style={styles.clipboardButton}
                  size={Button.sizes.small}
                />
              </View>
              <Text text70BO style={styles.cardTextFaint}>
                {'여기는 복구구문'}
              </Text>
            </View>
            <View style={styles.cardBackground} marginT-8>
              <View style={styles.textAndButton}>
                <Text text60M style={styles.cardTextBold}>
                  {TL.t('backup.backupSeed.privateKey')}
                </Text>
                <Button
                  marginT-16
                  marginR-16
                  backgroundColor="#5F5BE2"
                  label={TL.t('backup.backupSeed.copy')}
                  labelStyle={{ fontWeight: '600' }}
                  style={styles.clipboardButton}
                  size={Button.sizes.small}
                />
              </View>
              <Text text70BO style={styles.cardTextFaint}>
                {'여기는 개인키'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Button
            label={TL.t('initial.agree.next')}
            backgroundColor={Colors.Navy}
            size={Button.sizes.large}
            borderRadius={15}
            enableShadow={true}
            style={styles.button}
            disabled={false}
            onPress={navigateToBackupFin}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProvideWalletRecovery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Light0,
    justifyContent: 'space-between',
  },
  outline: {
    backgroundColor: Colors.Light0,
    flex: 1,
  },
  backupIcon: {
    justifyContent: 'center',
  },
  cards: {
    paddingHorizontal: Constants.PAGE_M1,
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
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
