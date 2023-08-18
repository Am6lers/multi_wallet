import EventEmitter from 'events';
import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';

export const APP_STATE_EVENTS = {
  CHANGE_NETWORK_STATE: 'changeNetworkState',
};

export default class AppStateController {
  name = 'AppStateController';

  hub = new EventEmitter();

  private _isNetworkConnected: boolean = false;
  private _networkSubscribe: NetInfoSubscription | undefined;
  private _subscribeNetworkState: (state: NetInfoState) => void;
  constructor() {
    this.hub.setMaxListeners(30);
    this._subscribeNetworkState = this.subscribeNetworkState.bind(this);
  }

  init() {
    if (this._networkSubscribe) {
      this._networkSubscribe();
    }
    this._networkSubscribe = NetInfo.addEventListener(
      this._subscribeNetworkState,
    );
  }

  // For network info listening
  subscribeNetworkState(state: NetInfoState) {
    this._isNetworkConnected = Boolean(state.isConnected);
    this.hub.emit(APP_STATE_EVENTS.CHANGE_NETWORK_STATE, state);
  }
}
