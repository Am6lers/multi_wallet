import React from 'react';
import { View, Image, Button } from 'react-native-ui-lib';
import { CIPHER_WITH_TITLE } from '@assets/images/roots';
import Colors from '@constants/colors';
import { StyleSheet } from 'react-native';
import CommonButton from '@components/atoms/CommonButton';
import TL from '@translate/index';

const Auth = () => {
  return (
    <View useSafeArea={true} style={styles.container}>
      <Image source={CIPHER_WITH_TITLE} style={styles.img} />
      <View style={styles.buttons}>
        <CommonButton
          lable={TL.t('initial.auth.create')}
          size={Button.sizes.large}
        />
        <CommonButton
          lable={TL.t('initial.auth.import')}
          size={Button.sizes.large}
          reverse={true}
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  buttons: {
    flex: 3,
  },
  button: {
    marginTop: 10,
  },
  img: {
    flex: 1,
    alignSelf: 'center',
  },
});
