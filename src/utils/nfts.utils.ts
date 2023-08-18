import { MoralisDataObjectValue } from 'moralis/common-core';

export const parseStringToObject = (
  metadata?: MoralisDataObjectValue | undefined,
): MoralisDataObjectValue | undefined => {
  try {
    if (typeof metadata === 'object' && typeof metadata !== 'string') {
      return metadata;
    } else if (metadata) {
      JSON.parse(metadata);
    }
    return metadata;
  } catch {
    return metadata;
  }
};

export const replaceIpfsUrl = (
  originUrl: string | undefined,
): string | undefined => {
  try {
    if (!originUrl) {
      return;
    }
    const trimmedUrlStr = originUrl.trim();
    if (!trimmedUrlStr) {
      return;
    }

    if (trimmedUrlStr.startsWith('ipfs://ipfs/')) {
      return trimmedUrlStr.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/');
    }
    if (trimmedUrlStr.startsWith('ipfs://')) {
      return trimmedUrlStr.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return trimmedUrlStr;
  } catch {
    return;
  }
};
