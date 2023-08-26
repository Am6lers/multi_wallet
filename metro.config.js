/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    presets: [
      [
        'module:metro-react-native-babel-preset',
        {
          unstable_transformProfile: 'hermes-stable',
        },
      ],
    ],
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      extraNodeModules: {
        stream: require.resolve('stream-browserify'),
        _stream_transform: require.resolve('readable-stream'),
      },
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs'],
    },
    dependencies: {
      'react-native-vector-icons': {
        platforms: {
          ios: null,
        },
      },
      'react-native-aes-crypto-forked': {
        platforms: {
          ios: null, // disable Android platform, other platforms will still autolink if provided
        },
      },
    },
  };
})();
