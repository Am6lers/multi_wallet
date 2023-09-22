import { Common } from 'web3-core';
export interface TransactionConfig {
  from?: string;
  to?: string;
  value?: number | string;
  gas?: number | string;
  gasPrice?: number | string;
  data?: string;
  nonce?: number | string;
  chainId?: number;
  common?: Common;
  chain?: string;
  hardfork?: string;
  gasLimit?: string;
  maxPriorityFeePerGas?: number | string;
  maxFeePerGas?: number | string;
}
