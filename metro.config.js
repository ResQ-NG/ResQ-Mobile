const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withMonicon } = require('@monicon/metro');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...(config.resolver || {}),
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'assets'),
  },
  // Pin a single React copy to prevent hook/context crashes.
  extraNodeModules: {
    ...((config.resolver && config.resolver.extraNodeModules) || {}),
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  },
};

const configWithMonicon = withMonicon(config);
module.exports = withNativeWind(configWithMonicon, { input: './global.css' });
