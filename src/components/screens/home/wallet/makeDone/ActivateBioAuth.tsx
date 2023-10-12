import React, { useEffect, useState } from 'react';
import {
  AnimatedScanner,
  Button,
  Spacings,
  Text,
  View,
} from 'react-native-ui-lib';
import FaceId from '@assets/icons/Face_ID.svg';
import { StyleSheet } from 'react-native';
import Constants from '@constants/app';
import Colors from '@constants/colors';
import CommonButton from '@components/atoms/CommonButton';
import TL from '@translate/index';

const ActivateBioAuth = ({ moveToNext }: { moveToNext: () => void }) => {
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress(prevValue => (prevValue === 0 ? 100 : 0));
    }, 1600);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.iconView}>
        <FaceId />
        <Text text65BO color={Colors.Gray} style={styles.faceId}>
          {'Face ID'}
        </Text>
        <AnimatedScanner
          progress={progress}
          duration={1600}
          hideScannerLine={true}
          containerStyle={styles.icons}
        />
        <Text text65BO style={styles.title} marginT={true}>
          {TL.t('initial.bio.title')}
        </Text>
      </View>
      <View style={styles.buttonView}>
        <CommonButton
          label={TL.t('initial.bio.skip')}
          size={Button.sizes.large}
          reverse={true}
          onPress={moveToNext}
        />
        <CommonButton
          label={TL.t('initial.bio.activate')}
          size={Button.sizes.large}
          style={styles.button}
          onPress={moveToNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.White,
  },
  iconView: {
    marginTop: Constants.WINDOW_HEIGHT / 10,
    alignItems: 'center',
  },
  icons: {
    height: 130,
    width: '100%',
    zIndex: 10,
  },
  faceId: {
    marginTop: Constants.WINDOW_HEIGHT / 30,
  },
  buttonView: {
    marginHorizontal: Constants.PAGE_M1,
  },
  button: {
    marginTop: Constants.BUTTON_S1,
  },
  title: {
    marginTop: 100,
    textAlign: 'center',
    marginHorizontal: 30,
  },
});

export default ActivateBioAuth;
