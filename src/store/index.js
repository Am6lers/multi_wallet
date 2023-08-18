import { createStore } from 'redux';
import {
  persistStore,
  persistReducer,
  createMigrate,
  createTransform,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from '../reducers';
import EngineService from '../core/EngineService';
import { migrations, version } from './migrations';
import { has } from 'lodash';
import Constants from '@constants/app';
import SecureStorage from '@utils/storage/SecureStorage';
import MMKVStorage from '@utils/storage/mmkvStorage';

// import Logger from '@common/Logger';
// timeout: null 값을 명시적으로 전달해야 초기화를 방지할 수 있음
const TIMEOUT = null;
/*
  *** BPW-005 민감 데이터 암호화 개선 ***
  keyringController의 데이터만 EncryptedStorage를 사용하도록 변경.
*/
const MigratedStorage = {
  async getItem(key) {
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
  async setItem(key, value) {
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
              Constants.PLATFORM == 'ios',
            );
          }
        }
      }
      return MMKVStorage.setItem(key, value, config.isIos());
    } catch (error) {
      // Logger.error(error, { message: 'Failed to set item' });
    }
  },
  async removeItem(key) {
    try {
      await SecureStorage.removeItem(key);
      return MMKVStorage.removeItem(key);
    } catch (error) {
      // Logger.error(error, { message: 'Failed to remove item' });
    }
  },
};

/**
 * Transform middleware that blacklists fields from redux persist that we deem too large for persisted storage
 */
const persistTransform = createTransform(
  inboundState => {
    const { PhishingController, ...controllers } =
      inboundState.backgroundState || {};

    if (has(PhishingController, ['phishing'])) {
      delete PhishingController.phishing;
    }
    if (has(PhishingController, ['whitelist'])) {
      delete PhishingController.whitelist;
    }

    // Reconstruct data to persist
    const newState = {
      backgroundState: {
        ...controllers,
        PhishingController,
      },
    };
    return newState;
  },
  null,
  { whitelist: ['engine'] },
);

const persistUserTransform = createTransform(
  inboundState => {
    // Reconstruct data to persist
    if (inboundState && has(inboundState, ['initialScreen'])) {
      delete inboundState?.initialScreen;
    }
    if (inboundState && has(inboundState, ['isAuthChecked'])) {
      delete inboundState?.isAuthChecked;
    }
    return inboundState;
  },
  null,
  { whitelist: ['user'] },
);

const persistConfig = {
  key: 'root',
  version,
  blacklist: ['onboarding', 'memoryInfo'],
  storage: MigratedStorage,
  transforms: [persistTransform, persistUserTransform],
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  migrate: createMigrate(migrations, { debug: false }),
  timeout: TIMEOUT,
  writeFailHandler: error => {},
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
