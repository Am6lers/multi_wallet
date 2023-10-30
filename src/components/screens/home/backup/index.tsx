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

const Backup = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [accetp, setAccept] = useState(false);
  const handleToAccept = () => {
    setAccept(!accetp);
  };

  const navigateToPinSetting = () => {
    navigation.navigate('ProvideWalletRecovery');
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
              <BackupIcon />
            </View>
            <View style={styles.cardBackground1}>
              <Text text60M style={styles.cardTextBold}>
                {TL.t('backup.notification.understand')}
              </Text>
              <Text text70BO style={styles.cardTextFaint}>
                {TL.t('backup.notification.understandDetail')}
              </Text>
            </View>
            <View style={styles.cardBackground2}>
              <View style={styles.textAndCheckbox}>
                <Text text60M style={styles.cardTextBold}>
                  {TL.t('backup.notification.agree')}
                </Text>
                <Checkbox
                  marginR-16
                  marginT-16
                  style={styles.checkbox}
                  value={accetp}
                  onValueChange={handleToAccept}
                />
              </View>
              <Text text70BO style={styles.cardTextFaint}>
                {TL.t('backup.notification.agreeDetail')}
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
            // 버튼 색상은 Figma 참고해서 수정할 것
            enableShadow={true}
            style={styles.button}
            disabled={!accetp}
            onPress={navigateToPinSetting}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Backup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.Light0,
  },
  outline: {
    backgroundColor: Colors.Light0,
    flex: 1,
  },
  backupIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cards: {
    paddingHorizontal: Constants.PAGE_M1,
  },
  cardBackground1: {
    zIndex: 1,
    elevation: 1,
    backgroundColor: Colors.White,
    width: 327,
    height: 192,
    borderRadius: 24,
  },
  cardBackground2: {
    marginTop: 8,
    zIndex: 1,
    elevation: 1,
    backgroundColor: Colors.White,
    width: 327,
    height: 112,
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
  textAndCheckbox: {
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
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
