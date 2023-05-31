import EncryptedStorage from 'react-native-encrypted-storage';
import MultiKeyringController, {
  KeyringState,
} from '@scripts/controllers/keyring/multiKeyringController';
import { atom, AtomEffect, DefaultValue } from 'recoil';

const persistAtom: AtomEffect<any> = ({ node, setSelf, onSet }) => {
  setSelf(
    EncryptedStorage.getItem(node.key).then(savedValue =>
      savedValue != null ? JSON.parse(savedValue) : new DefaultValue(),
    ),
  );

  onSet(newValue => {
    if (newValue instanceof DefaultValue) {
      EncryptedStorage.removeItem(node.key);
    } else {
      EncryptedStorage.setItem(node.key, JSON.stringify(newValue));
    }
  });
};

export const MultiKeyringState = atom<KeyringState>({
  key: 'KeyringState',
  default: {} as KeyringState,
  effects_UNSTABLE: [persistAtom],
});
