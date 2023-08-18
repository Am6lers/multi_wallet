import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import EventEmitter from 'events';
import { Linking } from 'react-native';
import CipherKeyringController from '../keyring';

export const DEEPLINK_EVENT = {
  RECIEVE_DEEPLINK_DATA: 'recieve DeepLink Data',
};

export interface DeepLinkControllerState extends BaseState {}

export interface DeepLinkControlOpts {
  initState: DeepLinkControllerState | undefined;
  keyringController: CipherKeyringController;
}

export enum LinkType {
  DeepLink = 'deepLink',
  UniversalLink = 'universalLink',
}

export enum ActionType {
  WalletConnect = 'walletConnect',
}

const wc_pattern = /wc:(.+)/;

export default class DeepLinkController extends BaseController<
  BaseConfig,
  DeepLinkControllerState
> {
  name = 'DeepLinkController';
  hub = new EventEmitter();
  private _keyrings: CipherKeyringController;
  savedLink: string | undefined;

  constructor(opts: DeepLinkControlOpts) {
    super(undefined, opts.initState ?? {});
    this._keyrings = opts.keyringController;
    this.checkRecieveDeepLinkData.bind(this)();
    Linking.addEventListener('url', this.setDeepLink.bind(this));
    this.hub.on(
      DEEPLINK_EVENT.RECIEVE_DEEPLINK_DATA,
      this.linkAction.bind(this),
    );
  }

  checkRecieveDeepLinkData() {
    Linking.getInitialURL().then(url => {
      console.log('DL checkRecieveDeepLinkData', url);
      if (url && this._keyrings.getIsUnlocked()) {
        this.hub.emit(DEEPLINK_EVENT.RECIEVE_DEEPLINK_DATA, url);
      } else {
        console.log('DL checkRecieveDeepLinkData save: ', url);
        this.savedLink = url ?? undefined;
      }
    });
  }

  setDeepLink({ url }: { url: string }) {
    if (this._keyrings.getIsUnlocked()) {
      this.hub.emit(DEEPLINK_EVENT.RECIEVE_DEEPLINK_DATA, url);
    } else {
      this.savedLink = url;
    }
  }

  utilizeSavedDeepLink() {
    console.log('DL useSavedDeepLink', this.savedLink);
    if (this.savedLink !== undefined) {
      this.hub.emit(DEEPLINK_EVENT.RECIEVE_DEEPLINK_DATA, this.savedLink);
      this.savedLink = undefined;
    }
  }

  classificationUrl(url: string) {
    const fixedUrl = decodeURIComponent(url);
    const linkType = fixedUrl.startsWith('pockie://')
      ? LinkType.DeepLink
      : LinkType.UniversalLink;
    const action = wc_pattern.exec(fixedUrl)?.[1];

    return {
      url: fixedUrl,
      linkType,
      actionUrl: action,
      actionType: ActionType.WalletConnect,
    };
  }

  linkAction(url: string) {
    const urlInfo = this.classificationUrl(url);
    if (urlInfo.actionType === ActionType.WalletConnect) {
    }
  }
}
