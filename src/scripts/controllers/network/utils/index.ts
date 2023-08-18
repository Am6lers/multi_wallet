import EventEmitter from 'events';

import { toBuffer } from 'ethereumjs-util';
import { MultiChainBlockTracker as EthBlockTracker } from '../../../../lib/biport-multichain-block-tracker';
import { isInfuraUrl } from '../../../../utils/common';
import {
  isPrefixedFormattedHexString,
  isSafeChainId,
} from '@utils/modules/network.utils';
import { map, eachSeries } from 'async';
import Stoplight from './util/stoplight';
import createPayload from './util/create-payload';
import { Web3ProviderEngineOpts, BlockData, EnginePayload } from './types';
import {
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
} from '../../../../lib/biport-json-rpc-engine';
import { PendingJsonRpcResponse } from '../../../../lib/biport-json-rpc-engine';
import { SECOND } from '@constants/time';

const noop = () => {};

export default class Web3ProviderEngine extends EventEmitter {
  private _getCurrentChainId: Web3ProviderEngineOpts['getCurrentChainId'];
  private _pollingInterval: Web3ProviderEngineOpts['pollingInterval'];
  private _getActiveNetwork: Web3ProviderEngineOpts['getActiveNetwork'];
  private _getPermittedRpcTargets: Web3ProviderEngineOpts['getPermittedRpcTargets'];
  _blockTracker: EthBlockTracker;
  private _ready: Stoplight;
  private _providers: any[];
  private _permittedChainInterval: NodeJS.Timer[];
  private _prevPermiitedChainSet: Set<string>;
  private _running: boolean;
  currentBlock: { [key: string]: BlockData };

  constructor(opts: Web3ProviderEngineOpts) {
    super();
    this.setMaxListeners(30);
    const self = this;
    const directProvider = class DirectProvider extends EventEmitter {
      sendAsync: (payload: EnginePayload, cb: any) => void;
      constructor() {
        super();
        this.sendAsync = self._handleAsync.bind(self);
      }
    };
    const blockTrackerProvider =
      opts.blockTrackerProvider || new directProvider();
    this._pollingInterval = opts.pollingInterval || 20 * SECOND;
    this._getActiveNetwork = opts.getActiveNetwork;
    this._getPermittedRpcTargets = opts.getPermittedRpcTargets;
    this._blockTracker =
      opts.blockTracker ||
      new EthBlockTracker({
        provider: blockTrackerProvider,
        getActiveNetwork: this._getActiveNetwork,
        getPermittedRpcTargets: this._getPermittedRpcTargets,
        pollingInterval: this._pollingInterval,
        setSkipCacheFlag: true,
      });
    this._getCurrentChainId = opts.getCurrentChainId;
    if (typeof this._getCurrentChainId !== 'function') {
      throw new Error('getCurrentChainId not a function.');
    }

    // set initialization blocker
    this._ready = new Stoplight();

    // local state
    this.currentBlock = {};

    this._providers = [];
    this._permittedChainInterval = [];
    this._prevPermiitedChainSet = new Set();
    this._running = false;
  }

  start(cb = noop) {
    // trigger start
    this._ready.go();
    this.startBindingTracker();

    // update state
    this._running = true;
    // signal that we started
    this.emit('start');
  }

  stop() {
    // stop block polling by removing event listeners
    if (this._blockTracker instanceof EthBlockTracker) {
      this._blockTracker.removeAllListeners();
    }
    // update state
    this._running = false;
    // signal that we stopped
    this.emit('stop');
  }

  isRunning() {
    return this._running;
  }

  addProvider(source: any, index?: number) {
    if (typeof index === 'number') {
      this._providers.splice(index, 0, source);
    } else {
      this._providers.push(source);
    }
    source.setEngine(this);
  }

  removeProvider(source: any) {
    const index = this._providers.indexOf(source);
    if (index < 0) {
      throw new Error('Provider not found.');
    }
    this._providers.splice(index, 1);
  }

  send(payload: EnginePayload) {
    throw new Error(
      `Web3ProviderEngine does not support synchronous requests. ${payload.method}`,
    );
  }

  sendAsync(payload: EnginePayload, cb: any) {
    this._ready.await(() => {
      if (Array.isArray(payload)) {
        // handle batch
        map(payload, this._handleAsync.bind(this), cb);
      } else {
        // handle single
        this._handleAsync(payload, cb);
      }
    });
  }

  getPermittedChainId() {
    const permittedRpcTargets = this._getPermittedRpcTargets();
    const permiitedChains = Object.keys(permittedRpcTargets);
    return permiitedChains;
  }

  defineRpcChainForResponse(
    req: JsonRpcRequest<any>,
    res: JsonRpcResponse<any>,
  ) {
    let biportChainId = null;
    const permittedRpcTargets = this._getPermittedRpcTargets();
    const permiitedChains = this.getPermittedChainId();
    if (validChainIdInParam(req._biportchainid)) {
      biportChainId = req._biportchainid || null;
    } else {
      biportChainId = this._getCurrentChainId();
    }
    if (
      !biportChainId ||
      !isPrefixedFormattedHexString(biportChainId) ||
      !isSafeChainId(parseInt(biportChainId, 16))
    ) {
      throw Error(
        'NetworkController - web3 provider engine - invalid chain id string',
      );
    }
    if (!biportChainId || !permiitedChains.includes(biportChainId)) {
      throw Error(
        'NetworkController - web3 provider engine  - not supported chain',
      );
    }
    res._biportchainid = biportChainId;
    res._isinfura = isInfuraUrl(permittedRpcTargets[biportChainId]);
    return res;
  }

  private startBindingTracker() {
    const permiitedChains = this.getPermittedChainId();
    const self = this;
    for (const chainId of permiitedChains) {
      // on new block, request block body and emit as events
      self._blockTracker.on(`latest:${chainId}`, blockNumber => {
        // get block body
        self._getBlockByNumberWithRetry(
          chainId,
          blockNumber,
          (err: JsonRpcError, block: any) => {
            if (err) {
              self.emit(`error:${chainId}`, err);
              return;
            }
            if (!block) {
              self.emit(
                `error:${chainId}`,
                new Error(`Could not find block (chainId: ${chainId})`),
              );
              return;
            }
            const bufferBlock = toBufferBlock(block);
            // set current + emit "block" event
            self._setCurrentBlock(chainId, bufferBlock);
            // emit other events
            self.emit(`rawBlock:${chainId}`, block);
            self.emit(`latest:${chainId}`, block);
          },
        );
      });

      // forward other events
      self._blockTracker.on(
        `sync:${chainId}`,
        self.emit.bind(self, `sync:${chainId}`),
      );
      self._blockTracker.on(
        `error:${chainId}`,
        self.emit.bind(self, `error:${chainId}`),
      );
    }
  }

  private _getBlockByNumberWithRetry(
    chainId: string,
    blockNumber: number,
    cb: any,
  ) {
    const self = this;
    let retriesRemaining = 5;

    attemptRequest();
    return;

    function attemptRequest() {
      self._getBlockByNumber(chainId, blockNumber, afterRequest);
    }

    function afterRequest(err: any, block: any) {
      // anomalous error occurred
      if (err) {
        return cb(err);
      }
      // block not ready yet
      if (!block) {
        if (retriesRemaining > 0) {
          // wait 1s then try again
          retriesRemaining--;
          setTimeout(function () {
            attemptRequest();
          }, 1000);
          return;
        } else {
          // give up, return a null block
          cb(null, null);
          return;
        }
      }
      // otherwise return result
      cb(null, block);
      return;
    }
  }

  private _getBlockByNumber(chainId: string, blockNumber: number, cb: any) {
    const req = createPayload({
      method: 'eth_getBlockByNumber',
      params: [blockNumber, false],
      skipCache: true,
      _biportchainid: chainId,
    });
    this._handleAsync(req, (err: any, res: any) => {
      if (err) {
        return cb(err);
      }

      return cb(null, res.result);
    });
  }

  private _handleAsync(payload: EnginePayload, finished: any) {
    const self = this;
    let currentProvider = -1;
    let result: any = null;
    let error: any = null;
    const stack: any[] = [];

    next();

    function next(after?: any) {
      currentProvider += 1;
      stack.unshift(after);
      // Bubbled down as far as we could go, and the request wasn't
      // handled. Return an error.
      if (currentProvider >= self._providers.length) {
        end(
          new Error(
            'Request for method "' +
              payload.method +
              '" not handled by any subprovider. Please check your subprovider configuration to ensure this method is handled.',
          ),
        );
      } else {
        try {
          var provider = self._providers[currentProvider];
          provider.handleRequest(payload, next, end);
        } catch (e) {
          end(e as Error);
        }
      }
    }

    function end(_error?: Error | null, _result?: any) {
      error = _error;
      result = _result;
      eachSeries(
        stack,
        function (fn: any, callback: any) {
          if (fn) {
            fn(error, result, callback);
          } else {
            callback();
          }
        },
        function () {
          if (!payload.id) {
            finished(new Error('Request id is undefined'), {
              id: undefined,
              jsonrpc: payload.jsonrpc || '2.0',
              result: result,
            });
            return;
          }
          let resultObj: PendingJsonRpcResponse<any> = {
            id: payload.id,
            jsonrpc: payload.jsonrpc || '2.0',
            result: result,
          };
          if (error !== null) {
            resultObj.error = {
              message: error.stack || error.message || error,
              code: -32000,
            };
            // respond with both error formats
            finished(error, resultObj);
          } else {
            finished(null, resultObj);
          }
        },
      );
    }
  }
  //
  // from remote-data
  //
  private _setCurrentBlock(chainId: string, block: BlockData) {
    this.currentBlock[chainId] = block;
    this.emit(`block:${chainId}`, block);
  }
}

function toBufferBlock(jsonBlock: any): BlockData {
  return {
    number: toBuffer(jsonBlock.number),
    hash: toBuffer(jsonBlock.hash),
    parentHash: toBuffer(jsonBlock.parentHash),
    nonce: toBuffer(jsonBlock.nonce),
    mixHash: toBuffer(jsonBlock.mixHash),
    sha3Uncles: toBuffer(jsonBlock.sha3Uncles),
    logsBloom: toBuffer(jsonBlock.logsBloom),
    transactionsRoot: toBuffer(jsonBlock.transactionsRoot),
    stateRoot: toBuffer(jsonBlock.stateRoot),
    receiptsRoot: toBuffer(jsonBlock.receiptRoot || jsonBlock.receiptsRoot),
    miner: toBuffer(jsonBlock.miner),
    difficulty: toBuffer(jsonBlock.difficulty),
    totalDifficulty: toBuffer(jsonBlock.totalDifficulty),
    size: toBuffer(jsonBlock.size),
    extraData: toBuffer(jsonBlock.extraData),
    gasLimit: toBuffer(jsonBlock.gasLimit),
    gasUsed: toBuffer(jsonBlock.gasUsed),
    timestamp: toBuffer(jsonBlock.timestamp),
    transactions: jsonBlock.transactions,
  };
}

function validChainIdInParam(chainId?: string) {
  return (
    chainId &&
    typeof chainId === 'string' &&
    isPrefixedFormattedHexString(chainId) &&
    isSafeChainId(parseInt(chainId, 16))
  );
}
