import { MMKV } from 'react-native-mmkv';
import config from '@constants/index';
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

const storage = new MMKV();
const uuid = config.UNIQUE_ID;

const setItem = (key: string, value: string) => {
  return storage.set(key, value);
};
const getItem = (key: string) => {
  return storage.getString(key);
};

const setEncryptedItem = (key: string, value: string, id?: string) => {
  const cipherText = AES.encrypt(value, id || uuid).toString();
  storage.set(key, cipherText);
};

const clear = () => {
  storage.clearAll();
};

const getEncryptedItem = (key: string, id?: string) => {
  const cipherText = storage.getString(key);
  if (cipherText) {
    const decryptedData = AES.decrypt(cipherText, id || uuid).toString(
      enc.Utf8,
    );
    return JSON.parse(decryptedData);
  }
  return undefined;
};

const removeItem = (key: string) => {
  return storage.delete(key);
};

const MMKVStorage = {
  setItem,
  getItem,
  setEncryptedItem,
  getEncryptedItem,
  removeItem,
  clear,
};
export default MMKVStorage;
