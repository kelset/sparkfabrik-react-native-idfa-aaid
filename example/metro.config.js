const path = require('node:path');

const exclusionList = (() => {
  try {
    return require('metro-config/src/defaults/exclusionList');
  } catch (_) {
    // `blacklist` was renamed to `exclusionList` in 0.60
    return require('metro-config/src/defaults/blacklist');
  }
})();

const blockList = exclusionList([
  // Block root project's copy of `react-native`
  /(?<!.*\/sparkfabrik-react-native-idfa-aaid)\/node_modules\/react\/.*/,
  /(?<!.*\/sparkfabrik-react-native-idfa-aaid)\/node_modules\/react-native\/.*/,
]);

const config = {
  resolver: {
    blacklistRE: blockList,
    blockList,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: [
    path.join(__dirname, 'node_modules', '@sparkfabrik/react-native-idfa-aaid'),
  ],
};

try {
  // Starting with react-native 0.72, we are required to provide a full config.
  const {
    getDefaultConfig,
    mergeConfig,
  } = require('@react-native/metro-config');
  module.exports = mergeConfig(getDefaultConfig(__dirname), config);
} catch (_) {
  module.exports = config;
}
