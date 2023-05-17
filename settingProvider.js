let fs = require('fs');
//const { default: config } = require('./src/config');
(function () {
  let shell = require('shelljs');
  //shell.cp('-r','./node_modules/@metamask/mobile-provider/dist/index.js', './src/core/InpageBridgeWeb3.js');
  shell.cp(
    '-r',
    './src/core/InpageBridgeWeb3.js',
    './android/app/src/main/assets/.',
  );
})();
