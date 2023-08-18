import React, { useEffect } from 'react';
import {
  View,
  Image,
  Button,
  Carousel,
  Text,
  Fader,
} from 'react-native-ui-lib';
import { CIPHER_WITH_TITLE } from '@assets/images/roots';
import Colors from '@constants/colors';
import { StyleSheet } from 'react-native';
import CommonButton from '@components/atoms/CommonButton';
import TL from '@translate/index';
import LottieView from 'lottie-react-native';
import {
  LOTTIE_SHILDE,
  LOTTIE_TRANSACTION,
  SECURE_CHAT,
  SECURE_NET,
  SECURE_TX,
} from '@assets/lottie/roots';
import Constant from '@constants/app';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const LottieItem = ({
  source,
  title,
}: {
  source: any;
  title: string;
}) => {
  return (
    <View>
      <Text text40 center>
        {title}
      </Text>
      <LottieView source={source} autoPlay={true} style={styles.lottie} />
    </View>
  );
};

const Auth = () => {
  const [page, setPage] = React.useState(0);
  const offset = useSharedValue(0);

  useEffect(() => {
    if (page === 3) {
      offset.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [page]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
    };
  });

  return (
    <View useSafeArea={true} style={styles.bg}>
      <View style={styles.container}>
        <Carousel
          style={styles.carousel}
          onChangePage={setPage}
          autoplay={true}
        >
          <LottieItem
            source={SECURE_CHAT}
            title={TL.t('initial.auth.secure_chat')}
          />
          <LottieItem
            source={SECURE_TX}
            title={TL.t('initial.auth.secure_tx')}
          />
          <LottieItem
            source={SECURE_NET}
            title={TL.t('initial.auth.secure_net')}
          />
          <Image source={CIPHER_WITH_TITLE} style={styles.img} />
        </Carousel>
        <Animated.View style={animatedStyles}>
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
        </Animated.View>
      </View>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,

    justifyContent: 'space-between',
  },
  carousel: {
    marginTop: 50,
  },
  button: {
    marginTop: 10,
  },
  lottie: {
    alignSelf: 'center',
    minHeight: Constant.SCREEN_HEIGHT / 2.5,
    minWidth: '100%',
  },
  img: {
    height: Constant.SCREEN_HEIGHT / 2,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
