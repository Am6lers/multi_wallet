import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import EventEmitter from 'events';
import Web3Personal from 'web3-shh';
import CipherKeyringController from '../keyring/cipherKeyringController';
import CipherKeyring from '../keyring/cipherKeyring';
import Web3 from 'web3';
import {
  WakuMessage,
  connect,
  isStarted,
  newNode,
  onMessage,
  peerID,
  relayPublish,
  relaySubscribe,
  start,
} from '@waku/react-native';

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

export interface MsgControllerState extends BaseState {
  messageData: MessageData;
}

export interface MsgControlOpts {
  initState: MsgControllerState | undefined;
  interval: number;
  keyringController: CipherKeyringController;
}

const wssEndPoint = 'wss://rpc-mainnet.matic.network';

export default class WakuMessageController extends BaseController<
  BaseConfig,
  MsgControllerState
> {
  name = 'MessageController';
  hub = new EventEmitter();

  private _keyring: CipherKeyringController;
  private messageData: MessageData = {};
  private interval: number | null = null;
  private superMasterKeyring: CipherKeyring;
  private peerId: string | null = null;

  constructor(opts: MsgControlOpts) {
    super(undefined, opts.initState ?? {});
    this._keyring = opts.keyringController;
    this.messageData = opts.initState?.messageData ?? {};
    this.interval = opts.interval;
    this.superMasterKeyring = this._keyring.getSuperMasterKeyring();
    this.hub.emit(MESSAGE_EVENT.SEND_MESSAGE_SUCCESS, this.messageProcessing);
  }

  async init() {
    const key = await this._keyring.getSuperMasterPrivateKey();
    if (key) {
      const nodeStarted = await isStarted();
      if (!nodeStarted) {
        await newNode(null);
        await start();
        this.peerId = await peerID();
        await relaySubscribe();
        await this.subscribeMessage();
      }
    }
  }

  async subscribeMessage() {
    onMessage(event => {
      console.log(
        'Message received: ',
        new TextDecoder().decode(event.wakuMessage.payload),
      );
    });
    try {
      await connect(
        '/dns4/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/30303/p2p/16Uiu2HAkvWiyFsgRhuJEb9JfjYxEkoHLgnUQmr1N5mKWnYjxYRVm',
        5000,
      );
    } catch (err) {
      console.log('Could not connect to peers');
    }

    try {
      await connect(
        '/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/30303/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ',
        5000,
      );
    } catch (err) {
      console.log('Could not connect to peers');
    }
  }

  async messageProcessing(message: WakuMessage) {
    const receivedMessage = new TextDecoder().decode(message.payload);
    const messageType = message.contentTopic?.startsWith('OTO:')
      ? MESSAGE_TYPE.OTO
      : MESSAGE_TYPE.NTN;
    const sender = message.contentTopic?.split(':')[1];
    const timestamp = message.timestamp;
    const group = message.contentTopic?.split(':')[1] || '';

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
    let msg = new WakuMessage();
    msg.contentTopic = 'OTO:0x191ee2600fc9f0fbf5ca7236e285b19f123dcec7';
    msg.payload = new TextEncoder().encode('Hi BoB');
    msg.timestamp = new Date();
    msg.version = 0;

    try {
      let messageID = await relayPublish(msg);
      this.hub.emit(MESSAGE_EVENT.SEND_MESSAGE_SUCCESS, msg);
    } catch (e) {
      this.hub.emit(MESSAGE_EVENT.SEND_MESSAGE_FAIL, msg);
    }
  }

  getMessageData() {
    return this.messageData;
  }

  onToOneRestore() {
    // this.shh.getFilterMessages
  }
}
