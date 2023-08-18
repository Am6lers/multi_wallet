import BigNumber from 'bignumber.js';
import { stripHexPrefix } from 'ethereumjs-util';
import { daiLogoExceptions } from '@constants/asset';

export const removeScientificNotationFromBigNumber = (
  bigNumber: BigNumber,
): string => bigNumber.toFixed(0).replace(/\.?0+$/, '');

export const capitalizeString = (str: string) =>
  (str && str.charAt(0).toUpperCase() + str.slice(1)) || false;

export const isUtf8 = (data: string) => {
  const rawMsg = data ? (data as string) : '';
  const stripedMsg = stripHexPrefix(rawMsg);
  // eslint-disable-next-line no-undef
  const buff = Buffer.from(stripedMsg, 'hex');
  const decodedMsg = buff.toString('utf8');
  let result = true;
  for (let i = 0; i < decodedMsg.length; i++) {
    if (decodedMsg.charCodeAt(i) > 65519) {
      result = false;
    }
  }
  return result;
};

export const daiImgResizer = (uri: string, size: number) => {
  let imgSize = size;
  if (
    daiLogoExceptions.map(reg => reg.test(uri ?? '')).filter(test => !!test)
      .length
  ) {
    imgSize = imgSize * 0.6;
  }
  return imgSize;
};

//array에서 입력받은 아이템을 제거하는 함수
export function removeItemOfArray(array: Array<any>, value: any) {
  let arr = [...array];
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
