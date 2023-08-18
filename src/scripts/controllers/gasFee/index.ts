import { BaseConfig, BaseController, BaseState } from '@metamask/controllers';
import { safelyExecute } from '@metamask/controllers/dist/util';
import EventEmitter from 'events';
import { ethers } from 'ethers';
import crypto from 'crypto';
// import Logger from '@common/Logger';
import {
  baseUrls,
  ButtonGasSpeed,
  CustomGasPrice,
  EstimatedWaitTime,
  GasIntegrationInfo,
  GasOracleData,
  GasSpeed,
  getCurrencyPrice,
  ProposeGasPrice,
  setProperty,
} from './utils';
import axiosClient from '@utils/axios';
import BigNumber from 'bignumber.js';
import {
  ChainId,
  POLYGON_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
} from '@constants/network';
import { GasPriceOracle } from 'gas-price-oracle';
import { ERC1155_ABI } from '@constants/erc1155abi';
import { ERC721_ABI } from '@constants/erc721abi';
import { GasFeeEstimates } from 'gas-price-oracle/lib/services';
import { FormattedPriceInfo } from '../../utils/numbers.utils';
import { TransactionConfig } from '../transaction/CipherMobileTransactionController';

export const GF_EVENTS = {
  RETURN_GAS_ORACLE_DATA: 'returnGasOracleData',
  START_GET_GAS_INTEGRATION_INFO: 'startGetGasIntegrationInfo',
  STOP_GET_GAS_INTEGRATION_INFO: 'sopGetGasIntegrationInfo',
  FAILED_GET_PRICE_OF_FEE: 'failed get price of fee',
  CHECK_IS_EIP_1559: 'check is eip1559',
};

const DEFAULT_SEND_NFT_AMOUNT: number = 1;

export type PricesInfo = {
  totalPrice: FormattedPriceInfo;
  tokenPrices: FormattedPriceInfo[];
};

export interface GasFeeControlState extends BaseState {
  //   interval: number;
}

export interface GasFeeControlOpts {
  initState: GasFeeControlState | undefined;
  networkController: BiportMobileNetworkController;
  pricesController: PricesController;
  interval: number;
}

export interface ExportGasFeeControllerStates {
  gas: BigNumber;
  gasData: GasOracleData | undefined;
  chainId: ChainId | undefined;
  isCurrentNetworkSupportEIP1559: boolean;
  isTestNet: boolean;
  selectedGasSpeed:
    | 'SafeGasPrice'
    | 'ProposeGasPrice'
    | 'FastGasPrice'
    | 'CustomGasPrice';
}

const randomId = crypto.randomBytes(32).toString('hex');
const dummyPk = '0x' + randomId;
const dummyWallet = new ethers.Wallet(dummyPk);
export default class GasFeeController extends BaseController<
  BaseConfig,
  GasFeeControlState
> {
  name = 'GasFeeController';
  hub = new EventEmitter();

  private intervalDelay: number;
  private _network: BiportMobileNetworkController;
  private _currencyPrices: PricesController;
  private pollingId: NodeJS.Timer | undefined;
  private gas: BigNumber;
  private gasData: GasOracleData | undefined;
  private chainId: ChainId | undefined;
  private isCurrentNetworkSupportEIP1559: boolean;
  private isTestNet: boolean;
  private isRunning: boolean;
  private getGasIntegrationInfoMethod: () => void;
  private selectedGasSpeed:
    | 'SafeGasPrice'
    | 'ProposeGasPrice'
    | 'FastGasPrice'
    | 'CustomGasPrice';
  private oracle: GasPriceOracle | undefined;
  private dummyReceiveAddress: string = dummyWallet.address;

  constructor(opts: GasFeeControlOpts) {
    super(undefined, opts.initState ?? {});
    this.intervalDelay = opts.interval;
    this._network = opts.networkController;
    this._currencyPrices = opts.pricesController;
    this.isCurrentNetworkSupportEIP1559 = false;
    this.isTestNet = false;
    this.isRunning = false;
    this.getGasIntegrationInfoMethod = this.getGasIntegrationInfo.bind(this);

    //change possible values
    this.gas = new BigNumber(0);
    this.chainId = undefined;
    this.selectedGasSpeed = ProposeGasPrice;

    this.hub.on(
      GF_EVENTS.START_GET_GAS_INTEGRATION_INFO,
      this.startGetGasInfo.bind(this),
    );
    this.hub.on(
      GF_EVENTS.STOP_GET_GAS_INTEGRATION_INFO,
      this.stopGetGasInfo.bind(this),
    );
  }

  getSelectedGasSpeed() {
    return this.selectedGasSpeed;
  }

  getSelectedGasPrice(selectedSpeed: ButtonGasSpeed) {
    return this.gasData?.[selectedSpeed];
  }

  getAllGasPrice() {
    return this.gasData;
  }

  getGas() {
    return this.gas;
  }

  getChainId() {
    return this.chainId;
  }

  getIsCurrentNetworkSupportEIP1559() {
    return this.isCurrentNetworkSupportEIP1559;
  }

  getRpcUrl(chainId: string) {
    const network = this._network.getNetworkByChainId(chainId);
    if (network) {
      return network.rpcTarget;
    }
    return;
  }

  getDummyReceiveAddress() {
    return this.dummyReceiveAddress;
  }

  setChainId(chainId?: ChainId) {
    if (chainId) {
      this.chainId = chainId;
      this.oracle = new GasPriceOracle({
        chainId: parseInt(this.chainId, 16),
        defaultRpc: this.getRpcUrl(chainId),
      });
    } else {
      this.chainId = undefined;
      this.oracle = undefined;
    }
  }

  multipleGasAmount(chainId: string, gasAmount: BigNumber) {
    return gasAmount.multipliedBy(1.2).dp(0, BigNumber.ROUND_CEIL);
  }

  //legacy transaction의 gasPrice를 low, middle, hight로 나누어 데이터를 가져오는 함수
  async getGasData() {
    if (
      this.selectedGasSpeed === 'CustomGasPrice' ||
      this.chainId === undefined
    ) {
      return;
    }
    const web3 = this._network.getWeb3Provider(this.chainId);
    const baseMutipleValue =
      this.chainId === POLYGON_CHAIN_ID ||
      this.chainId === POLYGON_MUMBAI_CHAIN_ID
        ? 1.6
        : 1.1;
    try {
      const res = await axiosClient.get(baseUrls[this.chainId]);
      const data = res?.data;
      if (data?.status && Number(data.status) === 1) {
        const result = data.result;
        const gasData: GasOracleData = setProperty({}, result);
        const newGasPrice = gasData[this.selectedGasSpeed];
        if (newGasPrice === undefined || newGasPrice === '0') {
          const web3GasPrice = new BigNumber(
            (await web3.eth.getGasPrice()).toString(),
          )
            .multipliedBy(baseMutipleValue)
            .dp(0, BigNumber.ROUND_FLOOR);
          this.gasData = {
            SafeGasPrice: web3GasPrice.toString(10),
            ProposeGasPrice: web3GasPrice.toString(10),
            FastGasPrice: web3GasPrice
              .multipliedBy(1.2)
              .decimalPlaces(0)
              .toString(10),
          } as GasOracleData;
          return false;
        } else {
          this.gasData = gasData;
          return true;
        }
      } else {
        const altValue = await web3.eth.getGasPrice();
        const altValueBn = new BigNumber(altValue.toString())
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR);
        const altGasPrice: GasOracleData = {
          SafeGasPrice: altValueBn.toString(10),
          ProposeGasPrice: altValueBn.toString(10),
          FastGasPrice: altValueBn
            .multipliedBy(1.2)
            .decimalPlaces(0)
            .toString(10),
        };
        this.gasData = altGasPrice;
        return false;
      }
    } catch (e: any) {
      const web3GasPrice = new BigNumber(
        (await web3.eth.getGasPrice()).toString(),
      )
        .multipliedBy(baseMutipleValue)
        .dp(0, BigNumber.ROUND_FLOOR);
      this.gasData = {
        SafeGasPrice: web3GasPrice.toString(10),
        ProposeGasPrice: web3GasPrice.toString(10),
        FastGasPrice: web3GasPrice
          .multipliedBy(1.2)
          .decimalPlaces(0)
          .toString(10),
      } as GasOracleData;
      // Logger.error(e, 'useGasOracle.tsx > getGasData()');
    }
  }

  //EIP-1559의 baseFee, maxFeePerGas, maxPriorityFeePerGas를 low, middle, hight에 맞게 가져오는 함수
  async getEIP1559GasData() {
    if (this.chainId === undefined || this.oracle === undefined) {
      throw Error('chain Id error!!');
    }
    const wei = new BigNumber(10).pow(9);
    const baseMutipleValue =
      this.chainId === POLYGON_CHAIN_ID ||
      this.chainId === POLYGON_MUMBAI_CHAIN_ID
        ? 1.6
        : 1.1;
    try {
      const { estimatedBaseFee, high, medium, low } =
        (await this.oracle.eip1559.estimateFeesPerSpeed()) as GasFeeEstimates;
      const waitTimes: EstimatedWaitTime = {
        ProposeGasPrice: {
          min: medium.minWaitTimeEstimate,
          max: medium.maxWaitTimeEstimate,
        },
        SafeGasPrice: {
          min: low.minWaitTimeEstimate,
          max: low.maxWaitTimeEstimate,
        },
        FastGasPrice: {
          min: high.minWaitTimeEstimate,
          max: high.maxWaitTimeEstimate,
        },
      };
      const maxFeesData = {
        SafeGasPrice: new BigNumber(low.suggestedMaxFeePerGas)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
        ProposeGasPrice: new BigNumber(medium.suggestedMaxFeePerGas)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
        FastGasPrice: new BigNumber(high.suggestedMaxFeePerGas)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
      };
      const maxPrioritysData = {
        SafeGasPrice: new BigNumber(low.suggestedMaxPriorityFeePerGas)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
        ProposeGasPrice: new BigNumber(medium.suggestedMaxPriorityFeePerGas)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
        FastGasPrice: new BigNumber(high.suggestedMaxPriorityFeePerGas)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
      };
      const EIP1559GasData = {
        SafeGasPrice: new BigNumber(low.suggestedMaxPriorityFeePerGas)
          .plus(estimatedBaseFee)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei)
          .toString(10),
        ProposeGasPrice: new BigNumber(medium.suggestedMaxPriorityFeePerGas)
          .plus(estimatedBaseFee)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei)
          .toString(10),
        FastGasPrice: new BigNumber(high.suggestedMaxPriorityFeePerGas)
          .plus(estimatedBaseFee)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei)
          .toString(10),
        baseFee: new BigNumber(estimatedBaseFee)
          .multipliedBy(baseMutipleValue)
          .dp(0, BigNumber.ROUND_FLOOR)
          .multipliedBy(wei),
        maxFeePerGas: maxFeesData,
        maxPriorityFeePerGas: maxPrioritysData,
        waitTime: waitTimes,
      } as GasOracleData;
      this.gasData = EIP1559GasData;
      return true;
    } catch (e) {
      const currentProvider = this._network.getWeb3Provider(this.chainId);
      const lastBlockNumber = await currentProvider.eth.getBlockNumber();
      const lastBlock = await currentProvider.eth.getBlock(lastBlockNumber);
      const baseFee = new BigNumber(lastBlock.baseFeePerGas || 0).div(wei);
      const maxFee = new BigNumber(baseFee)
        .multipliedBy(baseMutipleValue)
        .dp(0, BigNumber.ROUND_FLOOR)
        .multipliedBy(1.2);
      const priorityFee = new BigNumber(1);
      const gasPrice = new BigNumber(priorityFee)
        .multipliedBy(baseMutipleValue)
        .dp(0, BigNumber.ROUND_FLOOR)
        .plus(baseFee || 0)
        .multipliedBy(wei);
      const maxFeesData = {
        SafeGasPrice: maxFee.multipliedBy(wei),
        ProposeGasPrice: maxFee.multipliedBy(wei),
        FastGasPrice: maxFee.multipliedBy(1.2).multipliedBy(wei),
      };
      const maxPrioritysData = {
        SafeGasPrice: priorityFee.multipliedBy(wei),
        ProposeGasPrice: priorityFee.multipliedBy(wei),
        FastGasPrice: priorityFee.multipliedBy(1.2).multipliedBy(wei),
      };
      const EIP1559GasData = {
        SafeGasPrice: gasPrice.toString(10),
        ProposeGasPrice: gasPrice.toString(10),
        FastGasPrice: gasPrice.multipliedBy(1.2).decimalPlaces(0).toString(10),
        baseFee: baseFee.multipliedBy(wei),
        maxFeePerGas: maxFeesData,
        maxPriorityFeePerGas: maxPrioritysData,
      } as GasOracleData;
      this.gasData = EIP1559GasData;
      // Logger.error(e, 'useGasOracle.tsx > getGasData()');
      return false;
    }
  }

  //현재 선택되어있는 network가 EIP-1559를 지원하는지 확인하는 함수
  async checkCurrentNetworkSupportEIP1559(chainId: ChainId) {
    try {
      const currentProvider = this._network.getWeb3Provider(chainId);
      const lastBlockNumber = await currentProvider.eth.getBlockNumber();
      const lastBlock = await currentProvider.eth.getBlock(lastBlockNumber);
      const lastBlockBaseFeePerGas = lastBlock.baseFeePerGas;
      if (
        lastBlockBaseFeePerGas === undefined ||
        lastBlockBaseFeePerGas === null
      ) {
        this.isCurrentNetworkSupportEIP1559 = false;
      } else {
        this.isCurrentNetworkSupportEIP1559 = true;
      }
      this.hub.emit(
        GF_EVENTS.CHECK_IS_EIP_1559,
        this.isCurrentNetworkSupportEIP1559,
      );
      return this.isCurrentNetworkSupportEIP1559;
    } catch (e) {
      // Logger.error(e, 'checkCurrentNetworkSupportEIP1559');
      this.isCurrentNetworkSupportEIP1559 = false;
      this.hub.emit(
        GF_EVENTS.CHECK_IS_EIP_1559,
        this.isCurrentNetworkSupportEIP1559,
      );
      return this.isCurrentNetworkSupportEIP1559;
    }
  }

  //gas정보 polling을 시작하는 함수
  async startGetGasInfo(chainId: ChainId) {
    this.isRunning = true;
    const network = this._network.getNetworkByChainId(chainId);
    this.isTestNet = Boolean(network?.isTest);
    await this.checkCurrentNetworkSupportEIP1559(chainId);
    this.setChainId(chainId);
    await this.poll();
  }

  clearPoll() {
    this.pollingId && clearTimeout(this.pollingId);
  }

  async poll(): Promise<void> {
    this.clearPoll();
    if (!this.isRunning) {
      return;
    }
    await safelyExecute(() => this.getGasIntegrationInfo());
    this.pollingId = setTimeout(() => {
      this.poll();
    }, this.intervalDelay);
  }

  //일시 정지된 gas정보 polling을 재시작 하는 함수
  restartGetGasInfo() {
    this.isRunning = true;
    this.clearPoll();
    if (this.getChainId() !== undefined) {
      this.poll();
    } else {
      // Logger.log('chainId is undefined');
    }
  }

  //gas정보 polling을 일시 정지 하는 함수
  async pauseGetGasInfo() {
    this.clearPoll();
    this.pollingId = undefined;
    await this.getGasIntegrationInfo();
    this.isRunning = false;
  }

  //gas정보 polling을 멈추고 관련 데이터를 초기화 하는 함수
  stopGetGasInfo() {
    this.isRunning = false;
    this.clearPoll();
    this.gas = new BigNumber(0);
    this.gasData = undefined;
    this.isCurrentNetworkSupportEIP1559 = false;
    this.selectedGasSpeed = ProposeGasPrice;
    this.setChainId(undefined);
  }

  // 폴링중인지 아닌지 확인하고 폴링을 일시정지를 하는 함수
  terminatePollingGasInfo() {
    if (this.isRunning && this.pollingId !== undefined) {
      this.pauseGetGasInfo();
    }
  }

  // 폴링중이었는지 아닌지 확인하여 폴링중이었다면 폴링을 시작한는 함수
  initializePollingGasInfo() {
    if (!this.isRunning && this.chainId !== undefined) {
      this.restartGetGasInfo();
    }
  }

  //가스를 input으로 받은 값으로 변경하는 함수
  setCustomGas(newCustomGas: BigNumber) {
    this.gas = newCustomGas;
  }

  //legacy transaction의 gas관련 데이터를 event를 통해 넘기는 함수
  async setLegacyCustomGasInfo(
    newCustomGasPrice: BigNumber,
    newCustomGasLimit: BigNumber,
  ) {
    this.gas = newCustomGasLimit;
    const gasPrice = newCustomGasPrice;
    const fee = newCustomGasLimit
      .multipliedBy(gasPrice)
      .div(new BigNumber(10).pow(18));
    const feePrice: PricesInfo = await getCurrencyPrice(
      this.chainId,
      [fee.toString(10)],
      this._currencyPrices,
    );
    this.hub.emit(GF_EVENTS.RETURN_GAS_ORACLE_DATA, {
      selectedGasSpeed: this.selectedGasSpeed,
      gasPrice,
      customGas: newCustomGasLimit,
      fee,
      feePrice: feePrice.totalPrice.originalPrice,
      isUseOracle: false,
      info: {
        gasData: this.gasData,
        gas: this.gas,
      },
    } as GasIntegrationInfo);
  }

  //EIP-1559 transaction의 gas관련 데이터를 event를 통해 넘기는 함수
  async setEIP1559CustomGasInfo(
    newCustomGasLimit: BigNumber,
    newMaxFeePerGas: BigNumber,
    newMaxPriorityFeePerGas: BigNumber,
  ) {
    this.gas = newCustomGasLimit;
    const wei = new BigNumber(10).pow(9);
    const gasPrice = newMaxPriorityFeePerGas
      .plus(this.gasData?.baseFee?.div(wei) || 0)
      .multipliedBy(wei);
    const fee = newCustomGasLimit
      .multipliedBy(gasPrice)
      .div(new BigNumber(10).pow(18));
    const feePrice = await getCurrencyPrice(
      this.chainId,
      [fee.toString(10)],
      this._currencyPrices,
    );
    this.hub.emit(GF_EVENTS.RETURN_GAS_ORACLE_DATA, {
      selectedGasSpeed: this.selectedGasSpeed,
      gasPrice,
      customGas: newCustomGasLimit,
      fee,
      feePrice: feePrice.totalPrice.originalPrice,
      isUseOracle: false,
      maxFeePerGas: newMaxFeePerGas.multipliedBy(wei),
      baseFee: this.gasData?.baseFee,
      maxPriorityFeePerGas: newMaxPriorityFeePerGas.multipliedBy(wei),
      info: {
        gasData: this.gasData,
        gas: this.gas,
      },
    } as GasIntegrationInfo);
    return;
  }

  //low, middle, hight, custom 4가지 상태중 하나로 가스비 상태를 변경하는 함수
  async changeGasSpeed(newGasSpeed: GasSpeed) {
    this.selectedGasSpeed = newGasSpeed;
    const gasData = this.getAllGasPrice();
    const gas = this.getGas();
    if (newGasSpeed !== CustomGasPrice) {
      const { fee, feePrice, gasPrice } = await this.calculateGasPriceAndFee();
      this.hub.emit(GF_EVENTS.RETURN_GAS_ORACLE_DATA, {
        selectedGasSpeed: this.selectedGasSpeed,
        gasPrice,
        customGas: gas,
        fee,
        feePrice: feePrice.totalPrice.originalPrice,
        isUseOracle: true,
        waitTime: gasData?.waitTime,
        maxFeePerGas: gasData?.maxFeePerGas?.[this.selectedGasSpeed],
        baseFee: gasData?.baseFee,
        maxPriorityFeePerGas:
          gasData?.maxPriorityFeePerGas?.[this.selectedGasSpeed],
        info: {
          gasData,
          gas,
        },
      } as GasIntegrationInfo);
    }
    return;
  }

  //gas를 추정하는 함수
  async estimateGas(transactionConfig: TransactionConfig, chainId: ChainId) {
    const web3 = this._network.getWeb3Provider(chainId);
    try {
      if (web3) {
        const newGas = new BigNumber(
          (await web3.eth.estimateGas(transactionConfig as any)).toString(),
        );
        if (!transactionConfig.data) {
          this.gas = newGas;
          return newGas;
        }
        const lastBlockGasLimit = new BigNumber(
          (await web3.eth.getBlock('latest')).gasLimit.toString(),
        ).multipliedBy(0.9);
        const estimatedGas = this.multipleGasAmount(chainId, newGas);
        if (lastBlockGasLimit.isLessThan(estimatedGas)) {
          this.gas = lastBlockGasLimit;
          return lastBlockGasLimit;
        }
        this.gas = estimatedGas;
        return estimatedGas;
      } else {
        this.gas = new BigNumber(0);
        throw Error('wrong chainId');
      }
    } catch (e) {
      this.gas = new BigNumber(0);
      // Logger.error(e, 'web3 estimate gas error');
      this.stopGetGasInfo();
      this.hub.emit(GF_EVENTS.FAILED_GET_PRICE_OF_FEE);
    }
  }

  //EIP-721의 가스를 추정하는 함수
  async estimateGasEIP721({
    transactionConfig,
    chainId,
    tokenAddress,
    tokenId,
  }: {
    transactionConfig: TransactionConfig;
    chainId: ChainId;
    tokenAddress: string;
    tokenId: string;
  }) {
    try {
      const web3 = this._network.getWeb3Provider(chainId);
      const erc721Contract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
      const result = await erc721Contract.methods
        .transferFrom(
          transactionConfig.from,
          transactionConfig.to,
          web3.utils.toHex(tokenId),
        )
        .estimateGas({
          from: transactionConfig.from,
          data: transactionConfig.data,
        });

      this.gas = this.multipleGasAmount(chainId, new BigNumber(result));
      return new BigNumber(result);
    } catch (e) {
      // Logger.error(e, 'web3 estimate gas error');
      this.gas = new BigNumber(0);
      this.stopGetGasInfo();
      this.hub.emit(GF_EVENTS.FAILED_GET_PRICE_OF_FEE);
      return new BigNumber(0);
    }
  }

  //EIP-1155의 gas를 추정하는 함수
  async estimateGasEIP1155({
    transactionConfig,
    chainId,
    tokenAddress,
    tokenId,
    amount,
  }: {
    transactionConfig: TransactionConfig;
    chainId: ChainId;
    tokenAddress: string;
    tokenId: string;
    amount: string;
  }) {
    try {
      const web3 = this._network.getWeb3Provider(chainId);
      const erc1155Contract = new web3.eth.Contract(ERC1155_ABI, tokenAddress);
      const result = await erc1155Contract.methods
        .safeTransferFrom(
          transactionConfig.from,
          transactionConfig.to,
          web3.utils.toHex(tokenId),
          web3.utils.toHex(amount ?? DEFAULT_SEND_NFT_AMOUNT.toString()),
          web3.utils.fromAscii('0x0'),
        )
        .estimateGas({
          from: transactionConfig.from,
        });
      this.gas = this.multipleGasAmount(chainId, new BigNumber(result));
      return new BigNumber(result);
    } catch (e) {
      this.gas = new BigNumber(0);
      // Logger.error(e, 'web3 estimate gas error');
      this.stopGetGasInfo();
      this.hub.emit(GF_EVENTS.FAILED_GET_PRICE_OF_FEE);
      return new BigNumber(0);
    }
  }

  //nft중 eip721, eip1155를 구분하여 가스를 추정하는 함수
  async estimateNFTGas({
    transactionConfig,
    chainId,
    tokenAddress,
    tokenId,
    amount,
    isEIP721,
  }: {
    transactionConfig: TransactionConfig;
    chainId: ChainId;
    tokenAddress: string;
    tokenId: string;
    amount?: string;
    isEIP721: boolean;
  }) {
    try {
      if (isEIP721) {
        return await this.estimateGasEIP721({
          transactionConfig,
          chainId,
          tokenAddress,
          tokenId,
        });
      } else {
        return await this.estimateGasEIP1155({
          transactionConfig,
          chainId,
          tokenAddress,
          tokenId,
          amount: amount || '0',
        });
      }
    } catch (e) {
      this.gas = new BigNumber(0);
      // Logger.error(e, 'web3 estimate gas error');
      this.stopGetGasInfo();
      this.hub.emit(GF_EVENTS.FAILED_GET_PRICE_OF_FEE);
      return new BigNumber(0);
    }
  }

  //gas와 gasPrice를 사용하여 예상 수수료가 얼마인지 계산하는 함수
  async calculateGasPriceAndFee() {
    const gas = this.gas ?? this.getGas();
    const gasData = this.gasData ?? this.getAllGasPrice();
    const selectedGasSpeed = this.getSelectedGasSpeed();
    const chainId = this.getChainId();
    const isCurrentNetworkSupportEIP1559 =
      this.getIsCurrentNetworkSupportEIP1559();
    const gasPrice = new BigNumber(
      selectedGasSpeed !== 'CustomGasPrice'
        ? gasData?.[selectedGasSpeed] || '0'
        : '0',
    );

    let fee = new BigNumber(0);
    if (isCurrentNetworkSupportEIP1559) {
      const minimumFeePerGas: BigNumber = (
        gasData?.maxPriorityFeePerGas?.[selectedGasSpeed] as BigNumber
      ).plus(gasData?.baseFee || 0);
      const maxFeePerGas: BigNumber = gasData?.maxFeePerGas?.[selectedGasSpeed];
      if (minimumFeePerGas.isGreaterThan(maxFeePerGas)) {
        fee = gas.multipliedBy(minimumFeePerGas).div(new BigNumber(10).pow(18));
      } else {
        fee = gas.multipliedBy(maxFeePerGas).div(new BigNumber(10).pow(18));
      }
    } else {
      fee = gas.multipliedBy(gasPrice).div(new BigNumber(10).pow(18));
    }
    const feePrice = await getCurrencyPrice(
      chainId,
      [fee.toString(10)],
      this._currencyPrices,
    );
    return {
      fee,
      feePrice,
      gasPrice,
    };
  }

  calculateGasPriceAndFeeWithConfig({
    selectedGasSpeed,
    gasData,
    gas,
  }: {
    selectedGasSpeed:
      | 'SafeGasPrice'
      | 'ProposeGasPrice'
      | 'FastGasPrice'
      | 'CustomGasPrice';
    gasData?: GasOracleData | undefined;
    gas?: BigNumber | undefined;
  }) {
    const gasDataVal = gasData ? gasData : this.gasData;
    const gasVal = gas ? gas : this.gas;
    const gasPrice = new BigNumber(
      selectedGasSpeed !== 'CustomGasPrice'
        ? gasDataVal?.[selectedGasSpeed] || '0'
        : '0',
    );
    let fee = new BigNumber(0);
    if (this.isCurrentNetworkSupportEIP1559) {
      const minimumFeePerGas: BigNumber = (
        gasDataVal?.maxPriorityFeePerGas?.[selectedGasSpeed] as BigNumber
      ).plus(gasDataVal?.baseFee || 0);
      const maxFeePerGas: BigNumber =
        gasDataVal?.maxFeePerGas?.[selectedGasSpeed];
      if (minimumFeePerGas.isGreaterThan(maxFeePerGas)) {
        fee = gasVal
          .multipliedBy(minimumFeePerGas)
          .div(new BigNumber(10).pow(18));
      } else {
        fee = gasVal.multipliedBy(maxFeePerGas).div(new BigNumber(10).pow(18));
      }
    } else {
      fee = gasVal.multipliedBy(gasPrice).div(new BigNumber(10).pow(18));
    }
    return {
      fee,
      gasPrice,
    };
  }

  //종합적인 가스비를 Polling 로직에서 사용하는 함수
  async getGasIntegrationInfo() {
    if (
      this.selectedGasSpeed !== 'CustomGasPrice' &&
      this.isRunning === false
    ) {
      this.stopGetGasInfo();
    } else {
      try {
        await this.updateGasIntegrationInfo();
      } catch (e) {
        // Logger.log('getGasIntegrationInfo error');
        this.stopGetGasInfo();
        this.hub.emit(GF_EVENTS.FAILED_GET_PRICE_OF_FEE);
      }
    }
  }

  // 종합적인 가스비에 관련된 데이터를 계산하고 이벤트를 통해 반환하는 함수
  // 개별 사용을 위해 getGasIntegrationInfo에서 분리함
  async updateGasIntegrationInfo() {
    const isUseOracle = this.isCurrentNetworkSupportEIP1559
      ? await this.getEIP1559GasData()
      : await this.getGasData();
    const customGas = this.gas;
    console.log('updateGasIntegrationInfo - 0', this.gas);
    const { fee, feePrice, gasPrice } = await this.calculateGasPriceAndFee();
    console.log('updateGasIntegrationInfo - 1', fee, feePrice, gasPrice);
    if (fee.comparedTo(0) <= 0 || gasPrice.comparedTo(0) <= 0) {
      this.hub.emit(GF_EVENTS.FAILED_GET_PRICE_OF_FEE);
      return;
    } else {
      const gasInfo: GasIntegrationInfo = {
        selectedGasSpeed: this.selectedGasSpeed,
        gasPrice,
        customGas,
        fee,
        feePrice: feePrice.totalPrice.originalPrice,
        isUseOracle: typeof isUseOracle === 'boolean' ? isUseOracle : false,
        waitTime: this.gasData?.waitTime,
        maxFeePerGas: this.gasData?.maxFeePerGas?.[this.selectedGasSpeed],
        baseFee: this.gasData?.baseFee,
        maxPriorityFeePerGas:
          this.gasData?.maxPriorityFeePerGas?.[this.selectedGasSpeed],
        info: {
          gasData: this.gasData,
          gas: this.gas,
        },
      };
      this.hub.emit(GF_EVENTS.RETURN_GAS_ORACLE_DATA, gasInfo);
      return gasInfo;
    }
  }
  // 페이지 전환 후 가스비 컨트롤러 이어가기 위해 세팅값 내보내기
  exportGasFeeControllerStates(): ExportGasFeeControllerStates {
    return {
      gas: this.gas,
      gasData: this.gasData,
      chainId: this.chainId,
      isCurrentNetworkSupportEIP1559: this.isCurrentNetworkSupportEIP1559,
      isTestNet: this.isTestNet,
      selectedGasSpeed: this.selectedGasSpeed,
    };
  }
  // 페이지 전환 후 세팅값 받아서 가스비 구해오기 위해 세팅하는 기능
  importGasFeeControllerStates(states: ExportGasFeeControllerStates) {
    if (states.chainId) {
      this.setChainId(states.chainId);
    } else {
      return;
    }

    this.gas = states.gas;
    this.gasData = states.gasData;
    this.isCurrentNetworkSupportEIP1559 = states.isCurrentNetworkSupportEIP1559;
    this.isTestNet = states.isTestNet;
    this.selectedGasSpeed = states.selectedGasSpeed;
  }
}
