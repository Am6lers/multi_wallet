import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import EventEmitter from 'events';
import BiportKeyringController from '@scripts/controllers/keyring';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Encryptor from '@core/Encryptor';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import BiportPreferencesController from '@scripts/controllers/preferences';
import BackgroundTimer from 'react-native-background-timer';
import SecureStorage from '@utils/storage/SecureStorage';

/*
  *** BPW-008 무차별 대입 공격에 취약한 비밀번호 정책 ***
  PIN 이외에 강력한 보안을 위하여 Password 암호화 방식을 추가하여
  앱의 암호화 방식을 2가지로 관리하는 기능을 추가
  바이오 암호화 기능또한 controller에 통일하여 관리하도록 수정
  lock timer, 암호화 해제 횟수, lock 횟수 등을 관리하는 controller
*/

export const MAX_PIN_LENGTH = 6;

/** 온보딩 관련 시작 */
export enum StartTypes {
  Create = 'Create',
  Import = 'Import',
}

export enum OnBoardingImportType {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
}

export interface OnBoardingState {
  type?: StartTypes; // 시작 유형
  walletName?: string; // 지갑 이름
  encrypted?: string; // 암호화된 seed or privkey
  importType?: OnBoardingImportType; // seed or privkey
}

/**
 * 온보딩 Flow
 * 1. haveAgreedToTerms
 * 1-2. import seed or private key (only import)
 * 2. wallet name
 * 3. pin number -> 완료시점에 지갑 생성
 * 4. bio activity
 * 5. complete create
 * 5-1. backup confirm (only import)
 * 5-2. backup keys (only import)
 */
export type WalletInfoKeys = 'walletName' | 'privateKey' | 'mnemonic';
/** 온보딩 관련 끝 */

const Crypto = require('crypto-js');

export const ENCRYPTION_EVENT = {
  CREATED_PASSWORD: 'created password',
  CHANGED_PASSWORD: 'changed Password,',
  CHANGED_ACTIVATE_STATE: 'changed activate state',
  DECREASED_TIME: 'decreased time',
  ENDED_LOCK_TIMER: 'ended lock timer',
  ADDED_ERROR_COUNT: 'added error count',
  RESET_ERROR_COUNT: 'reset error count',
  ADDED_LOCK_COUNT: 'added lock count',
  RESET_LOCK_COUNT: 'reset lock count',
};

export enum PasswordType {
  Pin = 'pin',
  PWD = 'password',
}

export enum PWDActionType {
  LOGIN = 'login',
  AUTH = 'auth',
  CHANGE = 'change',
  VERIFY = 'verify',
}

export interface EncryptionControlState extends BaseState {
  passwordType: PasswordType;
  isActivateBio: boolean;
  remainLockTime: number;
  numberOfWrongPwd: number;
  errorCount: number;
}

export interface EncryptionControlOpts {
  initState: EncryptionControlState | undefined;
  keyringController: BiportKeyringController;
  preferencesController: BiportPreferencesController;
  encryptor: Encryptor;
}

export default class EncryptionController extends BaseController<
  BaseConfig,
  EncryptionControlState
> {
  name = 'EncryptionController';
  hub = new EventEmitter();
  private passwordType: PasswordType;
  private isActivateBio: boolean;
  private remainLockTime: number;
  private bgTimerIntervalId: number | undefined;
  private numberOfWrongPwd: number;
  private _keyring: BiportKeyringController;
  private _preferences: BiportPreferencesController;
  private _bio: ReactNativeBiometrics;
  private _errorCount: number;
  private _encryptor: Encryptor;
  private _isLock: boolean;
  private _isBackground: boolean;
  private _randomKey = Crypto.lib.WordArray.random(32);

  constructor(opts: EncryptionControlOpts) {
    super(undefined, opts.initState ?? {});
    this.passwordType = opts.initState?.passwordType || PasswordType.Pin;
    this.isActivateBio = opts.initState?.isActivateBio || false;
    this.remainLockTime = opts.initState?.remainLockTime || 0;
    this.numberOfWrongPwd = opts.initState?.remainLockTime || 0;
    this._errorCount = opts.initState?.errorCount || 0;
    this._keyring = opts.keyringController;
    this._preferences = opts.preferencesController;
    this._encryptor = opts.encryptor;
    this._isLock = false;
    this._isBackground = false;
    this._bio = new ReactNativeBiometrics({
      allowDeviceCredentials: false,
    });

    // this.hub.on(
    //   ENCRYPTION_EVENT.APP_IS_BACKGROUND,
    //   this.startBackgroundTimer.bind(this),
    // );
    // this.hub.on(
    //   ENCRYPTION_EVENT.APP_IS_FOREGROUND,
    //   this.stopBackgroundTimer.bind(this),
    // );
    if (this.remainLockTime > 0) {
      this.startLockTimer(this.remainLockTime);
    }
  }

  resetState() {
    this.update({});
  }

  getPasswordType() {
    return this.passwordType;
  }

  getIsActivateBio() {
    return this.isActivateBio;
  }

  //권한 거부
  permissionDenied() {
    // Toast.show('permissionDenied', DefaultToastMessageOptions({}));
  }

  updateAppBackgroundState(state: boolean) {
    this._isBackground = state;
  }

  getAppIsBackground() {
    return this._isBackground;
  }

  //바이오 센서 비활성화
  sensorNotAvailable() {
    // Toast.show(
    //   I18n.t('createWallet.bio.disable'),
    //   DefaultToastMessageOptions({}),
    // );
  }

  changeLockState(state: boolean) {
    this._isLock = state;
  }

  getLockState() {
    return this._isLock;
  }

  //데이터 암호화
  encryptData(password: string, privateKey: string) {
    return Crypto.AES.encrypt(password, privateKey).toString();
  }

  //데이터 복호화
  decryptData(data: string, privateKey: string) {
    return Crypto.AES.decrypt(data, privateKey).toString(Crypto.enc.Utf8);
  }

  addErrorCounter() {
    this._errorCount += 1;
    this.update({
      ...this.state,
      errorCount: this._errorCount,
    });
    this.hub.emit(ENCRYPTION_EVENT.ADDED_ERROR_COUNT, this._errorCount);
  }

  resetErrorCount() {
    this._errorCount = 0;
    this.update({
      ...this.state,
      errorCount: this._errorCount,
    });
    this.hub.emit(ENCRYPTION_EVENT.RESET_ERROR_COUNT, this._errorCount);
  }

  updateEncryptionControlData(type: PasswordType, isActivateBio: boolean) {
    this.passwordType = type;
    this.isActivateBio = isActivateBio;
    this.update({
      passwordType: type,
      isActivateBio: isActivateBio,
    });
  }

  changePasswordType(type: PasswordType) {
    this.updateEncryptionControlData(type, this.isActivateBio);
  }

  //패스워드를 암호화 하여 SecureStorage에 저장한는 함수
  async saveEncryptedPasswordUseKey(password: string, privateKey: string) {
    const encrypted = this.encryptData(password, privateKey);
    await SecureStorage.setItem('password', encrypted);
  }

  //
  async login(password: string) {
    try {
      const result = await this._keyring.submitPassword(password);
      return result;
    } catch (e) {
      throw new Error('login failed');
    }
  }

  //새로운 비밀번호로 value를 암호화 하는 함수
  async changePassword(
    password: string,
    newPassword: string,
    type: PasswordType,
    privateKey?: string,
  ) {
    const vault = this._keyring.state.vault;
    if (vault) {
      const decryptedVault = await this._encryptor.decrypt(password, vault);
      const newVault = await this._encryptor.encrypt(
        newPassword,
        decryptedVault,
      );
      const vaultObject = JSON.stringify({ vault: newVault });
      await AsyncStorage.setItem('vault', vaultObject);
      this._keyring.setLocked();
      await this._keyring.clearKeyrings();
      this._keyring.store.putState({ vault: newVault });
      this._keyring.update({ vault: newVault });
      await this._keyring.submitPassword(newPassword);
      await this.updateEncryptionControlData(type, this.isActivateBio);
      privateKey &&
        (await this.saveEncryptedPasswordUseKey(newPassword, privateKey));
    }
  }

  //바이오 센서 활성화 여부를 확인하는 함수
  isAvailableBioSensor = async (opts?: { hideToast: boolean }) => {
    try {
      const { biometryType } = await this._bio.isSensorAvailable();
      const available =
        biometryType === BiometryTypes.Biometrics ||
        biometryType === BiometryTypes.FaceID ||
        biometryType === BiometryTypes.TouchID;
      if (!available) {
        if (opts?.hideToast === true) {
          return false;
        }
        this.sensorNotAvailable();
        return false;
      }
      return available;
    } catch (e) {
      if (opts?.hideToast === true) {
        return false;
      }
      this.permissionDenied();
      return false;
    }
  };

  //바이오 인증을 활성화 하여 비밀번호를 저장하는 함수
  async setBioMetricsPassword(password: string, key?: string) {
    try {
      const privateKey = key || (await this.activateBioMetrics());
      if (privateKey) {
        const encrypted = this.encryptData(password, privateKey);
        await SecureStorage.setItem('password', encrypted);
        await this.updateEncryptionControlData(this.passwordType, true);
        this.hub.emit(ENCRYPTION_EVENT.CHANGED_ACTIVATE_STATE);
        return true;
      } else {
        return Promise.reject('inactivate biometrics');
      }
    } catch (e) {
      return Promise.reject(`${e}`);
    }
  }

  //바이오 인증 키값을 통하여 비밀번호와 키값을 반환 함수
  async getPasswordUseBiometrics() {
    try {
      const privateKey = await this.activateBioMetrics();
      if (privateKey) {
        const data = await SecureStorage.getItem('password');
        if (data) {
          const password: string = this.decryptData(data, privateKey);
          return { password, privateKey: privateKey };
        }
      }
    } catch (e) {
      return undefined;
    }
  }

  //바이오 인증을 통하여 로그인을 하는 함수
  async getBioMetricsPassword(
    fcmToken: string,
    additionalBioAction?: () => void,
  ) {
    try {
      const loginData = await this.getPasswordUseBiometrics();
      additionalBioAction?.();
      if (!loginData) {
        return false;
      }
      const { password } = loginData;
      await this._keyring.submitPassword(password);
      const selectedEvmAddress = this._preferences.getSelectedAddress();
      // await this._history.registerWalletAddressAsMonitoringTarget({
      //   account: selectedEvmAddress,
      //   fcmToken,
      //   platform: Platform.OS,
      //   env: __DEV__ ? 'dev' : 'prod',
      // });
      return true;
    } catch (e) {
      this.sensorNotAvailable();
      return false;
    }
  }

  registFCMToken = async (fcmToken: string) => {
    const selectedEvmAddress = this._preferences.getSelectedAddress();
    // await this._history.registerWalletAddressAsMonitoringTarget({
    //   account: selectedEvmAddress,
    //   fcmToken,
    //   platform: Platform.OS,
    //   env: __DEV__ ? 'dev' : 'prod',
    // });
  };

  //바이오 인증을 하고 privatekey를 반환하는 함수
  async activateBioMetrics() {
    try {
      const isAvailableBiometrics = await this.isAvailableBioSensor();
      if (isAvailableBiometrics) {
        try {
          const result = await this._bio.simplePrompt({
            promptMessage: '생체 인증',
          });
          if (result?.success) {
            const privateKey = await this._bio.createKeys().toString();
            return privateKey;
          } else {
            Promise.reject('failed biometrics');
            return undefined;
          }
        } catch (e) {
          Promise.reject('failed biometrics');
          return undefined;
        }
      } else {
        Promise.reject('failed biometrics');
        return undefined;
      }
    } catch (e) {
      Promise.reject(`${e}`);
      return undefined;
    }
  }
  //바이오 인증을 비활성화 하는 함수
  async inActivateBioMetrics() {
    await this.updateEncryptionControlData(this.passwordType, false);
    this.hub.emit(ENCRYPTION_EVENT.CHANGED_ACTIVATE_STATE);
  }

  getLockTime() {
    const fiveMin = 5 * 60;
    switch (this.numberOfWrongPwd) {
      case 0:
        return fiveMin;
      case 1:
        return fiveMin;
      case 2:
        return fiveMin;
      case 3:
        return fiveMin;
      default:
        return fiveMin;
    }
  }

  //암호 입력 잠금 타이머를 시작 하는 함수
  /*
    *** BPW-001 비밀번호 입력 횟수 검증 부재 ***
    처음을 2분으로 시작하여 최대 60분까지
    비밀 번호를 다시 입력 할 수 없도록 타이머를 세팅하는 함수
  */
  startLockTimer(remainTime?: number) {
    this.hub.emit(ENCRYPTION_EVENT.ADDED_LOCK_COUNT, this.numberOfWrongPwd + 1);
    this.remainLockTime = remainTime || this.getLockTime();
    this.numberOfWrongPwd += 1;
    this.bgTimerIntervalId = BackgroundTimer.setInterval(() => {
      this.remainLockTime -= 1;
      this.hub.emit(ENCRYPTION_EVENT.DECREASED_TIME, this.remainLockTime);
      this.update({
        ...this.state,
        remainLockTime: this.remainLockTime,
        numberOfWrongPwd: this.numberOfWrongPwd,
      });
      if (this.remainLockTime <= 0) {
        BackgroundTimer.clearInterval(this.bgTimerIntervalId as number);
        this.bgTimerIntervalId = undefined;
        this.hub.emit(ENCRYPTION_EVENT.ENDED_LOCK_TIMER);
      }
    }, 1000);
  }

  resetNumberOfWrongPwd() {
    this.numberOfWrongPwd = 0;
    this.hub.emit(ENCRYPTION_EVENT.RESET_LOCK_COUNT, this.numberOfWrongPwd);
  }

  getRemainLockTime() {
    return this.remainLockTime;
  }

  // 민감 정보 암호화
  encryptSensitiveInfo(sensitive: string) {
    console.log('sensitive', sensitive);
    const cipher = Crypto.AES.encrypt(
      sensitive,
      Crypto.enc.Utf8.parse(this._randomKey),
      {
        iv: Crypto.enc.Utf8.parse(''),
        padding: Crypto.pad.Pkcs7,
        mode: Crypto.mode.CBC,
      },
    );
    return cipher.toString();
  }

  // 민감 정보 복호화
  decryptSensitiveInfo(encrypted: string) {
    const cipher = Crypto.AES.decrypt(
      encrypted,
      Crypto.enc.Utf8.parse(this._randomKey),
      {
        iv: Crypto.enc.Utf8.parse(''),
        padding: Crypto.pad.Pkcs7,
        mode: Crypto.mode.CBC,
      },
    );
    return cipher.toString(Crypto.enc.Utf8);
  }
}
