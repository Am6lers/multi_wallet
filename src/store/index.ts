import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import EngineService from '../core/EngineService';
import SecureStorage from '@utils/storage/SecureStorage';
import MMKVStorage from '@utils/storage/mmkvStorage';
import { has } from 'lodash';

export const loadState = createAsyncThunk(
  'migratedStorage/loadState',
  async () => {
    try {
      const [rawItem, rawKeyringController] = await Promise.all([
        MMKVStorage.getItem('root'),
        SecureStorage.getItem('root'),
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
        return JSON.parse(resultItem);
      }
    } catch {
      // Fail silently
    }
    return undefined; // default state
  },
);

// createAsyncThunk for saving state
export const saveState = createAsyncThunk(
  'migratedStorage/saveState',
  async (state: any) => {
    try {
      const serializedState = JSON.stringify(state);
      if (serializedState && typeof serializedState === 'string') {
        const parsedItem = JSON.parse(serializedState);
        if (typeof parsedItem.engine === 'string') {
          const parsedEngine = JSON.parse(parsedItem.engine);
          const keyringController =
            parsedEngine?.backgroundState?.KeyringController;
          if (keyringController) {
            await SecureStorage.setItem(
              'root',
              JSON.stringify(keyringController),
            );
            delete parsedEngine.backgroundState.KeyringController;
            await MMKVStorage.setItem(
              'root',
              JSON.stringify({
                ...parsedItem,
                engine: JSON.stringify(parsedEngine),
              }),
            );
          }
        }
      }
    } catch (error) {
      console.warn(error, { message: 'Failed to save state' });
    }
  },
);

// createSlice for migratedStorage
const migratedStorageSlice = createSlice({
  name: 'migratedStorage',
  initialState: {},
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadState.fulfilled, (state, action) => {
      // EngineService.initalizeEngine(store); // 초기화
      return action.payload;
    });
  },
});

export const store = configureStore({
  reducer: migratedStorageSlice.reducer,
});

store.dispatch(loadState()).then(() => {
  EngineService.initalizeEngine(store);
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

// export const configureAppStore = async () => {
//   // const preloadedState = await loadState();
//   const store = configureStore({
//     reducer: appSlice.reducer,
//     preloadedState: loadState(),
//   });

//   store.subscribe(() => {
//     const state = store.getState();
//     MigratedStorage.saveState(state);
//   });

//   // EngineService.initalizeEngine(store);

//   return 'store';
// };
