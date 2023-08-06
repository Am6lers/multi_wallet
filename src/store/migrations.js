import { has } from 'lodash';

export const migrations = {
  0: state => {
    return state;
  },
  1: state => {
    if (!state?.engine?.backgroundState) {
      return state;
    }
    if (
      has(state, [
        'engine',
        'backgroundState',
        'EncryptionController',
        'remainLockTime',
      ])
    ) {
      state.engine.backgroundState.EncryptionController.remainLockTime = 0;
    }

    return state;
  },
};

export const version = 1;
