const { cloneDeep } = require('lodash');
const { getLoader, hookNormalModuleLoader, isMatch } = require('./utils');
const { PLUGIN_NAME } = require('./config');
const { globalLessMatchers } = require('./config/matchers');

class ArcoWebpackPluginForRemoveFontFace {
  apply(compiler) {
    const loader = require.resolve('./loaders/remove-font-face');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource, globalLessMatchers) && !getLoader(module.loaders, loader)) {
        const loaders = cloneDeep(module.loaders || []);
        loaders.push({
          loader,
        });
        module.loaders = loaders;
      }
    });
  }
}

module.exports = ArcoWebpackPluginForRemoveFontFace;
