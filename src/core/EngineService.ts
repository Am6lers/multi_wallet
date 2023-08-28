import UntypedEngine from './engine';

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
    console.log(
      "store EngineService's initalizeEngine called",
      store.getState().engine.backgroundState,
    );
    const backgroundState = store.getState().engine.backgroundState || {};
    const Engine = UntypedEngine as any;

    Engine.init(backgroundState);

    const controllers = [
      { name: 'KeyringController' },
      { name: 'NetworkController' },
      { name: 'PreferencesController' },
      { name: 'PhishingController' },
      { name: 'MessageManager' },
      { name: 'PersonalMessageManager' },
      { name: 'TypedMessageManager' },
      {
        name: 'ApprovalController',
        key: `${Engine.context.ApprovalController.name}:stateChange`,
      },
      { name: 'DeepLinkController' },
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
