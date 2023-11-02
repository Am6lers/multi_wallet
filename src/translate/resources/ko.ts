const resource = {
  initial: {
    auth: {
      create: '계정 생성하기',
      import: '계정 가져오기',
      secure_chat: '가장 안전한 채팅',
      secure_tx: '가장 안전한 거래',
      secure_net: '가장 안전한 네트워크',
    },
    stepBar: {
      nickname: '닉네임',
      password: '비밀번호',
      agree: '약관동의',
      account: '계정',
      inputNickname: '닉네임을 입력해주세요',
      inputAccount: '계정 정보를 입력해주세요',
    },
    agree: {
      title1: '어서오세요!',
      title2: '약관에 동의해주세요',
      selectAll: '모두 동의합니다',
      terms: '이용약관',
      privacy: '개인 정보 보호정책',
      next: '다음',
    },
    password: {
      create: '새로운 비밀번호를 입력해주세요',
      verify: '비밀번호를 입력해주세요',
      onemore: '비밀번호를 다시 한번 입력해주세요',
    },
    bio: {
      title: '스마트폰에 저장된 생체 정보로 암호를 해제할 수 있어요',
      skip: '스킵 하기',
      activate: '활성화 하기',
    },
    backup: {
      title: '안전한 계정이 생성되었어요',
      skip: '스킵 하기',
      backup: '백업하러 가기',
    },
    error: {
      pin: '비밀번호가 일치하지 않습니다',
    },
    import: {
      pase: '붙여넣기',
    },
  },
  login: {
    title: '로그인을 위해 비밀번호를 입력해주세요',
  },
  createNewWallet: {
    makeWallet: '지갑 생성',
    nickName: {
      notificationWalletName: '닉네임을 설정해주세요',
      walletName: '지갑 이름',
    },
    wizard: {
      settingWalletName: '지갑 이름 설정',
      settingPin: '핀 번호 설정',
      complete: '완료',
    },
    name: {
      validation: '지갑 이름을 입력해주세요.',
      notificationRightName: '영문 대, 소문자 및 숫자만 입력 가능해요.',
    },
    pin: {
      inputNewPwd: '새로운 비밀번호를 입력해주세요',
    },
  },
  backup: {
    header: '지갑 백업하기',
    notification: {
      understand: '복구구문 및 개인 키 이해하기',
      understandDetail:
        '1. 복구구문 및 개인키가 있으면 지갑 비밀번호를 잊었을 때 지갑을 복구할 수 있어요.\n2. 복구구문과 개인키를 반드시 안전한 곳에 저장해주세요.\n3. 절대 이 정보를 다른 사람과 공유하지 마세요.',
      agree: '동의하기',
      agreeDetail:
        '복구구문 및 개인키 분실 시 지갑을 복구할 수 없다는 사실을 인지합니다.',
    },
    backupSeed: {
      notification: '내 지갑의 복구구문을\n백업하세요',
      notificationDetail:
        '복구구문 또는 개인키를 아래와 같은 순서로 종이에 적거나 안전한 곳에 보관하세요.\n\n해당 단어들을 이용하면 언제든지갑을 복구할 수 있어요.',
      recovery: '복구구문',
      privateKey: '개인키',
      copy: '복사하기',
    },
    done: {
      notification: '지갑이름을\n성공적으로 불러왔어요!',
      notificationDetail:
        '이제부터 Pockie와 함께 다양한 네트워크의\n디지털 자산을 안전하게 활용해보세요!',
      complete: '완료',
    },
  },
  setting: {
    top: {
      all: '전체',
    },
    content: {
      wallet: '지갑',
      asset: '자산',
      security: '보안',
      setting: '설정',
      support: '지원',
    },
    wallet: {
      manage_wallet: '지갑 관리',
      manage_token: '토큰 관리',
    },
    asset: {
      send: '보내기',
      receive: '받기',
      send_nft: 'NFT 보내기',
      transactions: '거래내역',
    },
    security: {
      password: '비밀번호 및 생체 인증',
      connected_site: '연결된 사이트 관리',
    },
    setting: {
      currency: '기준 통화',
      language: '언어',
      notification: '알림 설정',
    },
    support: {
      faq: 'FAQ',
      website: '웹사이트',
      contact_feedback: '문의 및 피드백',
    },
  },
  tokenManagement: {
    assets: {
      header: '토큰 관리',
      total: '총 자산',
      search: '🔍 이름/주소로 토큰을 검색해보세요',
      sub: '숨겨진 자산이 포함된 금액이에요.',
    },
    addToken: {
      notification: '추가할 토큰의 주소를 입력해주세요',
      placeholder: '추가하고 싶은 토큰의 주소를 입력해주세요',
      error: '검색 결과가 없어요',
      selectToken: '추가할 토큰을 선택하세요',
    },
  },
};

export default resource;
