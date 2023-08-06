import { Dimensions, Platform, NativeModules, StatusBar } from 'react-native';

const PWDPATTERN = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}/;

const pkg = require('../../package.json');

const PLATFORM = Platform.select({
  android: 'android',
  ios: 'ios',
});

const ethToGwei = 1000000000000000000;

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

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

const isIos = () => {
  return Platform.OS === 'ios';
};

const APP_VERSION = isIos() ? pkg.versionIos : pkg.version;

export const FONTS = {
  Light: 'NotoSansKR-Light',
  Bold: 'NotoSansKR-Bold',
  Regular: 'NotoSansKR-Regular',
};

const SYSTEMLANGUAGE: string = getSystemLanguage();
const CURRENCY: string = getSystemLanguage() === 'English' ? 'usd' : 'krw';
const USER_AGENT = 'Biport';
const PADDING_HORIZONTAL_DEFAULT = 20;
const PADDING_VERTICAL_DEFAULT = 20;
const WEBVIEW_USER_AGENT =
  PLATFORM === 'android'
    ? 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/OSM1.180201.023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/76.0.3809.123 Mobile/15E148 Safari/605.1';

export default {
  PLATFORM,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  STATUS_BAR_HEIGHT,
  APP_VERSION,
  PWDPATTERN,
  ethToGwei,
  SYSTEMLANGUAGE,
  FONTS,
  CURRENCY,
  USER_AGENT,
  WEBVIEW_USER_AGENT,
  PADDING_HORIZONTAL_DEFAULT,
  PADDING_VERTICAL_DEFAULT,
  isIos,
};
