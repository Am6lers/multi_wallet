import {
  BaseConfig,
  BaseController,
  BaseControllerV2,
  BaseState,
} from '@metamask/controllers';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import RTCDataChannel from 'react-native-webrtc/lib/typescript/RTCDataChannel';
import UUID from 'react-native-uuid';
import CipherPreferencesController from '../preferences';

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

interface Rooms {
  [roomId: string]: {
    isHost: boolean;
    connection: RTCPeerConnection;
    dataChannel: RTCDataChannel;
    isConnect: boolean;
    offlineMessageQueue: Array<string>;
  };
}

export interface P2PConnectState extends BaseState {
  rooms: Rooms;
}

export interface GasFeeControlOpts {
  initState: P2PConnectState | undefined;
  preferencesController: CipherPreferencesController;
  interval: number;
}

export default class p2pConnectController extends BaseController<
  BaseConfig,
  P2PConnectState
> {
  private rooms: Rooms;
  private _preferences: CipherPreferencesController;

  constructor(opts: GasFeeControlOpts) {
    super(undefined, opts.initState ?? {});
    this.rooms = this.resetAllConnectState(opts.initState?.rooms ?? {});
    this._preferences = opts.preferencesController;
    registerGlobals();
    this.initialize();
  }

  createRoomId() {
    return UUID.v4();
  }

  resetAllConnectState(rooms: Rooms) {
    for (const roomId in rooms) {
      rooms[roomId].isConnect = false;
    }
    return rooms;
  }

  async JoinRoom(roomId: string) {
    const peerConnection = new RTCPeerConnection(configuration);
    const dataChannel = peerConnection.createDataChannel('text');
    dataChannel.onopen = () => {
      this.rooms?.[roomId]?.offlineMessageQueue.forEach(message => {
        dataChannel.send(message);
      });
    };
    peerConnection.ondatachannel = event => {
      const receivedDataChannel = event.channel;
      receivedDataChannel.onmessage = event => {
        console.log('Received message:', event.data);
      };
    };
    const offer = await peerConnection.createOffer({
      offerToReceiveVideo: false,
    });
    peerConnection.setLocalDescription(offer);
    this.rooms[roomId] = {
      isHost: true,
      connection: peerConnection,
      dataChannel: dataChannel,
      isConnect: true,
      offlineMessageQueue: this.rooms?.[roomId].offlineMessageQueue ?? [],
    };
    return JSON.stringify({ offer: peerConnection.localDescription });
  }

  async handleSignal(roomId: string, receivedSignal: string) {
    const pc = this.rooms[roomId]?.connection;
    const signal = JSON.parse(receivedSignal);

    if (signal.offer) {
      const remoteOffer = new RTCSessionDescription(signal.offer);
      await pc.setRemoteDescription(remoteOffer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      return JSON.stringify({ answer: pc.localDescription });
    } else if (signal.answer) {
      const remoteAnswer = new RTCSessionDescription(signal.answer);
      pc.setRemoteDescription(remoteAnswer);
      return undefined;
    }
  }

  sendMessage(roomId: string, message: string) {
    const { dataChannel, offlineMessageQueue } = this.rooms[roomId];
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(message);
    } else {
      offlineMessageQueue.push(message);
    }
  }
}
