const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Добавляем поддержку импорта CSS из node_modules
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.test && oneOfRule.test.toString().includes('css')) {
              oneOfRule.include = undefined;
            }
          });
        }
      });

      // Добавляем поддержку Cesium
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "http": false,
        "https": false,
        "zlib": false,
        "fs": false
      };

      return webpackConfig;
    }
  }
};