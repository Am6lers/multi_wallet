import React from 'react';
import { View, Image } from 'react-native-ui-lib';
import { CIPHER_WITH_TITLE } from '@assets/images/roots';

const Login = () => {
  return (
    <View useSafeArea={true}>
      <Image source={CIPHER_WITH_TITLE} />
    </View>
  );
};

export default Login;
