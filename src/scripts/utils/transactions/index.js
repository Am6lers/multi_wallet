import { addHexPrefix } from 'ethereumjs-util';

export const TOKEN_METHOD_TRANSFER = 'transfer';
export const TOKEN_METHOD_APPROVE = 'approve';
export const TOKEN_METHOD_TRANSFER_FROM = 'transferfrom';
export const CONTRACT_METHOD_DEPLOY = 'deploy';
export const CONNEXT_METHOD_DEPOSIT = 'connextdeposit';

export const SEND_ETHER_ACTION_KEY = 'sentEther';
export const DEPLOY_CONTRACT_ACTION_KEY = 'deploy';
export const APPROVE_ACTION_KEY = 'approve';
export const SEND_TOKEN_ACTION_KEY = 'transfer';
export const TRANSFER_FROM_ACTION_KEY = 'transferfrom';
export const UNKNOWN_FUNCTION_KEY = 'unknownFunction';
export const SMART_CONTRACT_INTERACTION_ACTION_KEY = 'smartContractInteraction';
export const SWAPS_TRANSACTION_ACTION_KEY = 'swapsTransaction';

export const TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb';
export const TRANSFER_FROM_FUNCTION_SIGNATURE = '0x23b872dd';
export const APPROVE_FUNCTION_SIGNATURE = '0x095ea7b3';
export const CONTRACT_CREATION_SIGNATURE = '0x60a060405260046060527f48302e31';

/**
 * Returns method data object for a transaction dat
 *
 * @param {string} data - Transaction data
 * @param {any} transactionController - Data to decode
 * @returns {object} - Method data object containing the name if is valid
 */
export async function getMethodData(data, transactionController) {
  if (data.length < 10) return {};
  const fourByteSignature = data.substr(0, 10);
  if (fourByteSignature === TRANSFER_FUNCTION_SIGNATURE) {
    return { name: TOKEN_METHOD_TRANSFER };
  } else if (fourByteSignature === TRANSFER_FROM_FUNCTION_SIGNATURE) {
    return { name: TOKEN_METHOD_TRANSFER_FROM };
  } else if (fourByteSignature === APPROVE_FUNCTION_SIGNATURE) {
    return { name: TOKEN_METHOD_APPROVE };
  } else if (data.substr(0, 32) === CONTRACT_CREATION_SIGNATURE) {
    return { name: CONTRACT_METHOD_DEPLOY };
  }
  // If it's a new method, use on-chain method registry
  try {
    const registryObject = await transactionController.handleMethodData(
      fourByteSignature,
    );
    if (registryObject) {
      return registryObject.parsedRegistryMethod;
    }
  } catch (e) {
    // Ignore and return empty object
  }
  return {};
}

/**
 * Returns method data object for a transaction dat
 *
 * @param {any} data - Transaction dataecode
 * @returns {object} - Method data object containing the name if is valid
 */
export function decodeApproveData(data) {
  return {
    spenderAddress: addHexPrefix(data.substr(34, 40)),
    encodedAmount: data.substr(74, 138),
  };
}
