import UntypedEngine from './Engine';

const UPDATE_BG_STATE_KEY = 'UPDATE_BG_STATE';
const INIT_BG_STATE_KEY = 'INIT_BG_STATE';

/**
 * Redux에서 Engine을 초기화하고 생성합니다.
 */

class EngineService {
  private engineInitialized = false;

  /**
   * Initializer for the EngineService
   *
   * @param store - Redux store
   */
  initalizeEngine = (store: any) => {
    const reduxState = store.getState?.();
    const state = reduxState?.engine?.backgroundState || {};
    const Engine = UntypedEngine as any;

    Engine.init(state);

    const controllers = [
      { name: 'KeyringController' },
      { name: 'NetworkController' },
      { name: 'PreferencesController' },
      { name: 'PhishingController' },
      { name: 'TransactionController' },
      { name: 'MessageManager' },
      { name: 'PersonalMessageManager' },
      { name: 'TypedMessageManager' },
      { name: 'MultiChainBalanceTracker' },
      {
        name: 'ApprovalController',
        key: `${Engine.context.ApprovalController.name}:stateChange`,
      },
      { name: 'AccountAssetTracker' },
      { name: 'WalletConnectController' },
      { name: 'GasFeeController' },
      { name: 'HistoryController' },
      { name: 'TrendyTokenController' },
      { name: 'EncryptionController' },
      { name: 'PricesController' },
    ];

    Engine?.datamodel?.subscribe?.(() => {
      if (!this.engineInitialized) {
        store.dispatch({ type: INIT_BG_STATE_KEY });
        this.engineInitialized = true;
      }
    });

    controllers.forEach((controller, idx) => {
      const { name, key = undefined } = controller;
      const update_bg_state_cb = () =>
        store.dispatch({ type: UPDATE_BG_STATE_KEY, key: name });
      if (!key) {
        Engine.context[name].subscribe(update_bg_state_cb);
      } else {
        Engine.controllerMessenger.subscribe(key, update_bg_state_cb);
      }

      if (idx === controllers.length - 1) {
      }
    });
  };
}

/**
 * EngineService class used for initializing and subscribing to the engine controllers
 */
export default new EngineService();
