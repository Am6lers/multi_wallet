import { useRecoilState } from 'recoil';
import { MultiKeyringState } from './states';
import MultiKeyringController, {
  KeyringState,
} from '@scripts/controllers/keyring/multiKeyringController';
import { useEffect } from 'react';
import * as bip39 from 'bip39';
import Encryptor from './Encryptor';

const Engine = () => {
  const [keyringState, setKeyringState] =
    useRecoilState<KeyringState>(MultiKeyringState);
  const encryptor = new Encryptor();
  const keyringController = new MultiKeyringController({
    initState: keyringState,
    encryptor: encryptor,
  });

  useEffect(() => {
    keyringController.store.subscribe(updateKeyringState);
    return () => {
      keyringController.store.unSubscribe(updateKeyringState);
    };
  }, []);

  const updateKeyringState = (value: any) => {
    setKeyringState(value);
  };

  const createNewVaultAndKeychain = async (password: string) => {
    // const releaseLock = await this.createVaultMutex.acquire();
    try {
      let vault;
      const accounts = await keyringController.getAccounts();
      if (accounts.evm.length > 0 || accounts.evm.length > 0) {
        vault = await keyringController.fullUpdate();
      } else {
        vault = await keyringController.createNewVaultAndKeychain(password);
        const keys = await keyringController.getSerializedAccounts();
        // PreferencesController.setAddresses(keys);
        // const selectAddressKey = this.selectFirstIdentity();
        //   await this.setNativeTokensWithNewWallet([selectAddressKey]);
        // }
        return vault;
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const CreateNewWallet = async (password: string) => {
    const mnemonic = bip39.generateMnemonic();
    await createNewVaultAndKeychain(password);
    return await keyringController.createNewVaultAndRestore(password, mnemonic);
  };

  return {
    keyringController: keyringController,
    CreateNewWallet,
    createNewVaultAndKeychain,
  };
};

export default Engine;
