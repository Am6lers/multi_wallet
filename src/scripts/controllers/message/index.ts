import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import EventEmitter from 'events';
import Web3Personal from 'web3-shh';
import CipherKeyringController from '../keyring/cipherKeyringController';
import CipherKeyring from '../keyring/cipherKeyring';
import Web3 from 'web3';

/*
1:1 chat topic rule
`OTO:${address}`
n:n chat topic rule (except myself)
'NTN:${address1}:${address2}:${address3}...'
*/

export const MESSAGE_EVENT = {
  RECEIVE_MESSAGE: 'receive message',
  SEND_MESSAGE_SUCCESS: 'send message success',
  SEND_MESSAGE_FAIL: 'send message fail',
};

enum MESSAGE_TYPE {
  OTO = 'OTO',
  NTN = 'NTN',
}

export interface Notification {
  hash: string;
  sig?: string;
  recipientPublicKey?: string;
  timestamp: string;
  ttl: number;
  topic: string;
  payload: string;
  padding: number;
  pow: number;
}

export interface Message {
  isFriends: boolean;
  isRegistered: boolean;
  receivedMessage: string;
  sender: string;
  timestamp: string;
  group: string;
}

interface MessageData {
  [roomId: string]: {
    type: MESSAGE_TYPE;
    messages: Message[];
    lastTimeStamp: string;
  };
}

export interface GasFeeControlState extends BaseState {
  messageData: MessageData;
}

export interface GasFeeControlOpts {
  initState: GasFeeControlState | undefined;
  interval: number;
  keyringController: CipherKeyringController;
}

const wssEndPoint = 'wss://rpc-mainnet.matic.network';

export default class MessageController extends BaseController<
  BaseConfig,
  GasFeeControlState
> {
  name = 'GasFeeController';
  hub = new EventEmitter();

  private _keyring: CipherKeyringController;
  private messageData: MessageData = {};
  private interval: number | null = null;
  private shh: Web3Personal;
  private superMasterKeyring: CipherKeyring;

  constructor(opts: GasFeeControlOpts) {
    super(undefined, opts.initState ?? {});
    this._keyring = opts.keyringController;
    this.messageData = opts.initState?.messageData ?? {};
    this.interval = opts.interval;
    this.shh = new Web3Personal(wssEndPoint);
    this.superMasterKeyring = this._keyring.getSuperMasgerKeyring();
    // this.hub.on(MESSAGE_EVENT.RECEIVE_MESSAGE,this.messageProcessing)
  }

  init() {
    this.shh
      .subscribe('messages', {
        privateKeyID: this.superMasterKeyring.evmWallet?.getPrivateKeyString(),
      })
      .on('data', (message: Notification) => {
        this.messageProcessing(message);
      });
  }

  async messageProcessing(message: Notification) {
    if (!message.sig) {
      return;
    }
    const receivedMessage = Web3.utils.toAscii(message.payload);
    const messageType = message.topic.startsWith('OTO:')
      ? MESSAGE_TYPE.OTO
      : MESSAGE_TYPE.NTN;
    const sender = message.sig;
    const timestamp = message.timestamp;
    const group = message.topic;

    const isRegistered = true; // api
    const isFriends = true; // api
    const newMessage = {
      isFriends,
      isRegistered,
      receivedMessage,
      sender,
      timestamp,
      group,
    };
    this.messageData = {
      ...this.messageData,
      [group]: this.messageData?.[group]
        ? {
            type: this.messageData?.[group].type,
            messages: [...this.messageData?.[group].messages, newMessage],
            lastTimeStamp: timestamp,
          }
        : {
            type: messageType,
            messages: [newMessage],
            lastTimeStamp: timestamp,
          },
    };
    this.hub.emit(MESSAGE_EVENT.RECEIVE_MESSAGE, newMessage);
  }

  async sendMessage(message: string, receiveAddresses: string[]) {
    try {
      const senderAddress =
        this.superMasterKeyring.evmWallet?.getAddressString() ?? '';
      await Promise.all(
        receiveAddresses.map(async receiveAddress => {
          await this.shh.post({
            ttl: 10,
            topic: senderAddress,
            powTarget: 2.01,
            powTime: 2,
            payload: Web3.utils.fromAscii(message),
            pubKey: receiveAddress, // B의 공개 키
            sig: senderAddress, // A의 키 페어 ID
          });
        }),
      );
      this.hub.emit(MESSAGE_EVENT.SEND_MESSAGE_SUCCESS, true);
    } catch (e) {
      this.hub.emit(MESSAGE_EVENT.SEND_MESSAGE_FAIL, false);
    }
  }

  getMessageData() {
    return this.messageData;
  }

  onToOneRestore() {
    // this.shh.getFilterMessages
  }
}
