const resource = {
  initial: {
    auth: {
      create: 'Create Account',
      import: 'Import Account',
      secure_chat: 'Secure Chat',
      secure_tx: 'Secure Transaction',
      secure_net: 'Secure Network',
    },
    stpeBar: {
      nickname: 'Nickname',
      password: 'Password',
      agree: 'Agree',
      account: 'account',
      inputNickname: 'Please enter your nickname',
      inputAccount: 'Please enter your account',
    },
    agree: {
      title1: 'Welcome!',
      title2: 'Please agree to the terms',
      selectAll: 'I agree to all',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      next: 'Next',
      agree: 'Agree',
    },
    password: {
      create: 'Please enter a new password',
      verify: 'Please enter your password',
      onemore: 'Please enter your password again',
    },
    bio: {
      title:
        'You can unlock your password with the biometric information stored on your smartphone.',
      skip: 'Skip',
      activate: 'Activate',
    },
    backup: {
      title: 'Your account has been created safely.',
      skip: 'Skip',
      backup: 'Go to backup',
    },
    error: {
      pin: 'The password does not match',
    },
    import: {
      pase: 'Paste',
    },
  },
  login: {
    title: 'Please enter your password to log in',
  },
  createNewWallet: {
    makeWallet: 'Make Wallet',
    nickName: {
      notificationWalletName: 'Please set a nickname',
      walletName: 'Wallet Name',
    },
    wizard: {
      settingWalletName: 'Set wallet name',
      settingPin: 'Pin number setting',
      complete: 'Complete',
    },
    name: {
      validation: 'Please enter your wallet name.',
      notificationRightName:
        'Only uppercase and lowercase letters and numbers can be entered.',
    },
    pin: {
      inputNewPwd: 'Please enter a new password.',
    },
  },
  backup: {
    header: 'Back up your wallet',
    notification: {
      understand: 'Understanding recovery syntax and private keys',
      understandDetail:
        '1. If you have the recovery phrase and private key, you can recover your wallet if you forget your wallet password.\n2. Be sure to save the recovery phrase and private key in a safe place.\n3. Never share this information with anyone.',
      agree: 'Agree',
      agreeDetail:
        'I acknowledge that my wallet cannot be recovered if the recovery phrase and private key are lost.',
    },
    backupSeed: {
      notification: "Back up your wallet's\n recovery phrase",
      notificationDetail:
        'Write the recovery phrase or private key on paper in the following order or store it in a safe place.\n\nYou can recover your wallet at any time using the corresponding words.',
      recovery: 'recovery syntax',
      privateKey: 'Private Key',
      copy: 'Copy',
    },
    done: {
      notification: 'The wallet name was successfully loaded!',
      notificationDetail:
        'From now on, use digital assets from various networks safely with Pockie!',
      complete: 'Complete',
    },
  },
};

export default resource;
