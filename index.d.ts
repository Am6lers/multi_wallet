import { EvmHistory } from './src/scripts/controllers/history';

declare global {
  var passedEvmHistoryForLockScreen: EvmHistory | undefined;
}

export {};
