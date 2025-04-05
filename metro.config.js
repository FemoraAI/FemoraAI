const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx'],
  },
  serializer: {
    // Add this section
    getModulesRunBeforeMainModule: () => [],
    getPolyfills: () => [],
  },
  // Add this section
  logger: {
    warn: (message) => {
      if (message.includes('defaultProps')) {
        return;
      }
      console.warn(message);
    },
  },
};
