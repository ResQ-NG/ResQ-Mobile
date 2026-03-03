const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...(config.resolver || {}),
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  // Pin a single React copy to prevent hook/context crashes.
  extraNodeModules: {
    ...((config.resolver && config.resolver.extraNodeModules) || {}),
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
