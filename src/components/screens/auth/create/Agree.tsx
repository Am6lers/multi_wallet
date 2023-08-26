import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Checkbox,
  Drawer,
  GridList,
  GridView,
  ListItem,
  Spacings,
  Text,
  View,
} from 'react-native-ui-lib';
import Colors from '@constants/colors';
import LottieView from 'lottie-react-native';
import { LOTTIE_AGREE } from '@assets/lottie/roots';
import Constant from '@constants/app';
import TL from '@translate/index';
import CommonButton from '@components/atoms/CommonButton';
import ARROW from '@assets/icons/chevron_right.svg';
import Constants from '@constants/app';

const Agree = ({ moveToNext }: { moveToNext: () => void }) => {
  const [selectAll, setSelectAll] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);

  useEffect(() => {
    if (agreeTerms && agreePrivacy) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [agreeTerms, agreePrivacy]);

  const selectAllHandler = useCallback((value: boolean) => {
    if (!value) {
      setSelectAll(false);
      setAgreeTerms(false);
      setAgreePrivacy(false);
    } else {
      setSelectAll(true);
      setAgreeTerms(true);
      setAgreePrivacy(true);
    }
  }, []);

  const showTermsHandler = useCallback(() => {
    setShowTerms(true);
  }, []);

  const showPrivacyHandler = useCallback(() => {
    setShowPrivacy(true);
  }, []);

  return (
    <View useSafeArea={true} style={styles.container}>
      <View style={styles.top}>
        <Text text40 center>
          {TL.t('initial.agree.title1')}
        </Text>
        <Text text40 center>
          {TL.t('initial.agree.title2')}
        </Text>
        <LottieView
          source={LOTTIE_AGREE}
          autoPlay={true}
          style={styles.lottie}
        />
      </View>
      <Button
        style={styles.button}
        onPress={selectAllHandler}
        backgroundColor={Colors.White}
        enableShadow={true}
        s
      >
        <Text text65BO>{TL.t('initial.agree.selectAll')} </Text>
        <Checkbox
          value={selectAll}
          color={Colors.PointColor}
          onValueChange={selectAllHandler}
        />
      </Button>
      <Button
        style={styles.button}
        onPress={showTermsHandler}
        backgroundColor={Colors.White}
        enableShadow={true}
      >
        <Text text65R>{TL.t('initial.agree.terms')} </Text>
        <ARROW />
      </Button>
      <Button
        style={styles.button}
        onPress={showPrivacyHandler}
        backgroundColor={Colors.White}
        enableShadow={true}
      >
        <Text text65R>{TL.t('initial.agree.privacy')} </Text>
        <ARROW />
      </Button>
      <CommonButton
        label={TL.t('initial.agree.next')}
        size={Button.sizes.large}
        disabled={!agreeTerms || !agreePrivacy}
        onPress={moveToNext}
      />
    </View>
  );
};

export default Agree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: Constants.PAGE_M1,
  },
  lottie: {
    alignSelf: 'center',
    minHeight: Constant.SCREEN_HEIGHT / 3,
    minWidth: '100%',
  },
  top: {
    marginTop: Constant.SCREEN_HEIGHT / 20,
  },
  button: {
    justifyContent: 'space-between',
    marginVertical: 6,
    height: 50,
  },
});
