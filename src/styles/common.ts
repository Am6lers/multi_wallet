import BigNumber from 'bignumber.js';
import { ViewStyle, StyleSheet, Dimensions } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Colors from './colors';
import { BorderRadiuses } from 'react-native-ui-lib';

export const pagePaddingHorizontal: ViewStyle = {
  paddingHorizontal: responsiveWidth(6.4),
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const STATIC_WIDTH = 375;
const STATIC_HEIGHT = 812;
const ratioGap = 0.05;

export const responsiveHeightBySize = (size: number): number => {
  return responsiveHeight(
    new BigNumber(size).dividedBy(STATIC_HEIGHT / 100).toNumber(),
  );
};

export const getTargetRatio = () => {
  return STATIC_WIDTH / STATIC_HEIGHT;
};

export const getDeviceRatio = () => {
  return windowWidth / windowHeight;
};

export const getRatioType = () => {
  console.log(getTargetRatio(), getDeviceRatio());
  console.log(-ratioGap);
  console.log(getTargetRatio() - getDeviceRatio());
  if (getTargetRatio() - getDeviceRatio() < -ratioGap) {
    return -1;
  } else if (getTargetRatio() - getDeviceRatio() > ratioGap) {
    return 1;
  } else {
    return 0;
  }
};

export const responsiveWidthBySize = (size: number): number => {
  return responsiveWidth(
    new BigNumber(size).dividedBy(STATIC_WIDTH / 100).toNumber(),
  );
};

export const toastStyle = StyleSheet.create({
  toastWrapper: {
    height: responsiveHeightBySize(48),
    width: 'auto',
    borderRadius: BorderRadiuses.br50,
    backgroundColor: Colors.PointColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidthBySize(16),
    opacity: 0.9,
  },
  toastText: {
    color: Colors.White,
    fontSize: responsiveWidthBySize(14),
    fontWeight: '700',
  },
});
