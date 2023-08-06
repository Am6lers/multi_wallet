import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

export const userState = atom({
  key: 'userState',
  default: '',
});

export const accountState = atom({
  key: 'accountState',
  default: false,
});
