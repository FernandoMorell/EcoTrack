const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configuración para SVG y Victory Native
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'victory-native': require.resolve('victory-native')
};

module.exports = config;
