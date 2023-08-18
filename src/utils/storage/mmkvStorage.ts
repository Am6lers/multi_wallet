import { MMKV } from 'react-native-mmkv';
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import uuid from 'react-native-uuid';

const storage = new MMKV();

const getSecretKey = () => {
  let key = storage.getString('secretKey');
  if (!key) {
    key = uuid.v4().toString();
    storage.set('secretKey', key);
  }
  return key;
};

const uniqueId = getSecretKey();

const setItem = (key: string, value: string) => {
  return storage.set(key, value);
};
const getItem = (key: string) => {
  return storage.getString(key);
};

const setEncryptedItem = (key: string, value: string, id?: string) => {
  const cipherText = AES.encrypt(value, id || uniqueId).toString();
  storage.set(key, cipherText);
};

const clear = () => {
  storage.clearAll();
};

const getEncryptedItem = (key: string, id?: string) => {
  const cipherText = storage.getString(key);
  if (cipherText) {
    const decryptedData = AES.decrypt(cipherText, id || uniqueId).toString(
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
