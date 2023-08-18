import { SizeLevel, SizeMap } from './types';

export const adjustSize = <T>(size: SizeLevel, map: SizeMap<T>): T => {
  if (!size || !map?.[size]) {
    return map['md'];
  }
  return map[size];
};
