import Clipboard from '@react-native-clipboard/clipboard';
import { addHexPrefix, isValidPrivate, stripHexPrefix } from 'ethereumjs-util';

export function validatePrivateKey(privateKey: string) {
  try {
    if (privateKey?.length !== 64) {
      return false;
    }
    const privateKeyHex = addHexPrefix(privateKey);
    const stripped = stripHexPrefix(privateKeyHex);
    const buffer = Buffer.from(stripped, 'hex');
    return isValidPrivate(buffer);
  } catch (e) {
    return false;
  }
}

export const clipPause = async (setter: (res: string) => void) => {
  const data = await Clipboard.getString();
  data && setter(data);
};

export const clipCopy = async (text: string) => {
  await Clipboard.setString(text);
};

export const removeTrailingCommas = (str: string) => {
  return str.replace(/,+$|,+$/g, '');
};
