import { Dimensions, Platform, NativeModules, StatusBar } from 'react-native';
import { getFontScale } from 'react-native-device-info';

const PWDPATTERN = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}/;

const pkg = require('../../package.json');

const PLATFORM = Platform.select({
  android: 'android',
  ios: 'ios',
});

const APP_VERSION = PLATFORM == 'ios' ? pkg.versionIos : pkg.version;

const getSystemLanguage = () => {
  let systemLanguage = '';
  if (Platform.OS === 'ios') {
    systemLanguage =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else {
    systemLanguage = NativeModules.I18nManager.localeIdentifier;
  }
  // AOS
  // KOR: ko_KR
  // ENG: en_US
  const language =
    systemLanguage.toLowerCase().indexOf('ko') >= 0 ? '한국어' : 'English';
  return language;
};
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const BUTTON_S1 = 10;
const PAGE_M1 = 20;
const PAGE_M2 = 10;
export const MILLISECOND = 1;
export const SECOND = MILLISECOND * 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const ASSET_PRICE_UPDATE_TIME = SECOND * 8;
const REQUEST_TIMEOUT = 20 * SECOND;
const WEB3_REQUEST_TIMEOUT = 10 * MINUTE;
const SystemLanguage = getSystemLanguage();
const CURRENCY: string = SystemLanguage === 'English' ? 'usd' : 'krw';
const USER_AGENT = 'Cipher';
const WEBVIEW_USER_AGENT =
  PLATFORM === 'android'
    ? 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/OSM1.180201.023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/76.0.3809.123 Mobile/15E148 Safari/605.1';

export default {
  PLATFORM,
  APP_VERSION,
  PWDPATTERN,
  WEBVIEW_USER_AGENT,
  CURRENCY,
  USER_AGENT,
  REQUEST_TIMEOUT,
  WEB3_REQUEST_TIMEOUT,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SCREEN_HEIGHT,
  BUTTON_S1,
  PAGE_M1,
  PAGE_M2,
};
