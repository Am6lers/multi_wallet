module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@common': './src/common',
          '@config': './src/config',
          '@core': './src/core',
          '@hooks': './src/hooks',
          '@i18n': './src/i18n',
          '@lib': './src/lib',
          '@models': './src/models',
          '@store': './src/store',
          '@providers': './src/providers',
          '@reducers': './src/reducers',
          '@scripts': './src/scripts',
          '@styles': './src/styles',
          '@types': './src/types',
          '@utils': './src/utils',
          '@util': './src/util',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: false,
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'], //removing consoles.log from app during release (production) versions
    },
  },
};
