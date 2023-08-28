import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createMigrate,
  createTransform,
} from 'redux-persist';
import EngineService from '../core/EngineService';
import SecureStorage from '@utils/storage/SecureStorage';
import MMKVStorage from '@utils/storage/mmkvStorage';
import { has } from 'lodash';
import rootReducer from '../reducers';
import { legacy_createStore as createStore } from 'redux';

const TIMEOUT = null;
/*
  *** BPW-005 민감 데이터 암호화 개선 ***
  keyringController의 데이터만 EncryptedStorage를 사용하도록 변경.
*/
const MigratedStorage = {
  async getItem(key: string) {
    try {
      const [rawItem, rawKeyringController] = await Promise.all([
        MMKVStorage.getItem(key),
        SecureStorage.getItem(key),
      ]);
      if (rawItem) {
        let resultItem = rawItem;
        if (rawKeyringController && typeof rawKeyringController === 'string') {
          const parsedItem = JSON.parse(rawItem);
          if (
            has(parsedItem, ['engine']) &&
            typeof parsedItem.engine === 'string'
          ) {
            const parsedEngine = JSON.parse(parsedItem.engine);
            parsedEngine.backgroundState.KeyringController =
              JSON.parse(rawKeyringController);
            resultItem = JSON.stringify({
              ...parsedItem,
              engine: JSON.stringify(parsedEngine),
            });
          }
        }
        // Using new storage system
        return resultItem;
      }
    } catch {
      //Fail silently
    }
  },
  async setItem(key: string, value: any) {
    try {
      if (value && typeof value === 'string') {
        const parsedItem = JSON.parse(value);
        if (typeof parsedItem.engine === 'string') {
          const parsedEngine = JSON.parse(parsedItem.engine);
          const keyringController =
            parsedEngine?.backgroundState?.KeyringController;
          if (keyringController) {
            await SecureStorage.setItem(key, JSON.stringify(keyringController));
            delete parsedEngine.backgroundState.KeyringController;
            return MMKVStorage.setItem(
              key,
              JSON.stringify({
                ...parsedItem,
                engine: JSON.stringify(parsedEngine),
              }),
            );
          }
        }
      }
      return MMKVStorage.setItem(key, value);
    } catch (error) {
      // Logger.error(error, { message: 'Failed to set item' });
    }
  },
  async removeItem(key: string) {
    try {
      await SecureStorage.removeItem(key);
      return MMKVStorage.removeItem(key);
    } catch (error) {
      // Logger.error(error, { message: 'Failed to remove item' });
    }
  },
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: MigratedStorage,
  transforms: [],
  timeout: TIMEOUT,
  writeFailHandler: (error: any) => {},
  // Logger.error(error, { message: 'Error persisting data' }), // Log error if saving state fails
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);

/**
 * Initialize services after persist is completed
 */
const onPersistComplete = () => {
  EngineService.initalizeEngine(store);
};

export const persistor = persistStore(store, null, onPersistComplete);
