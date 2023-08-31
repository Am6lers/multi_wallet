import { atom } from 'recoil';

export interface Loading {
  loading: boolean;
  message: string;
}

export const isExistAccountState = atom({
  key: 'isExistAccountState',
  default: false,
});

export const loadingState = atom<Loading>({
  key: 'loadingState',
  default: undefined,
});

export const superMasterName = atom<string>({
  key: 'superMasterName',
  default: '',
});
