import EncryptedStorage from 'react-native-encrypted-storage';
import Keychain from 'react-native-keychain';
import config from '@constants/index';
// import Logger, { SentryVaultAction } from '@common/Logger';
import MMKVStorage from './mmkvStorage';

const isLogin = MMKVStorage.getItem('isLogin') === 'true' ? true : false;

interface SecureStorageType {
  getItem: (key: string) => Promise<any>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

const setItem = async (key: string, value: string) => {
  if (config.isIos()) {
    let objData: Object | undefined;
    const data = await Keychain.getGenericPassword();
    if (data) {
      const savedData = JSON.parse(data.password);
      objData = {
        ...savedData,
        [key]: value,
      };
    } else {
      isLogin;
      // &&Logger.sendVaultErrorContext(SentryVaultAction.Hydrate);
      objData = {
        [key]: value,
      };
    }
    await Keychain.setGenericPassword('ios-data', JSON.stringify(objData));
  } else {
    EncryptedStorage.setItem(key, value);
  }
};

const getItem = async (key: string) => {
  try {
    if (config.isIos() && key) {
      const oldValue = await EncryptedStorage.getItem(key);
      if (oldValue) {
        EncryptedStorage.removeItem(key);
        setItem(key, oldValue);
        return oldValue;
      }
      const data = await Keychain.getGenericPassword();
      if (data) {
        const jsonData = data.password;
        const objData = JSON.parse(jsonData)?.[key];
        return objData;
      } else {
        isLogin;
        // && Logger.sendVaultErrorContext(SentryVaultAction.Hydrate);
      }
    }
    return await EncryptedStorage.getItem(key);
  } catch {
    return await EncryptedStorage.getItem(key);
  }
};

const removeItem = async (key: string) => {
  if (config.isIos()) {
    const data = await Keychain.getGenericPassword();
    if (data) {
      const savedData = JSON.parse(data.password);
      delete savedData?.[key];
      Keychain.setGenericPassword('ios-data', JSON.stringify(savedData));
    }
  } else {
    EncryptedStorage.removeItem(key);
  }
};

const clear = async () => {
  await EncryptedStorage.clear();
  await Keychain.resetGenericPassword();
};

const SecureStorage: SecureStorageType = {
  getItem,
  setItem,
  removeItem,
  clear,
};

export default SecureStorage;