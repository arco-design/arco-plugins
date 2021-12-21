const { cloneDeep, merge } = require('lodash');
const { getLoader, hookNormalModuleLoader, isMatch } = require('./utils');
const { PLUGIN_NAME } = require('./config');
const { esLocalDefaultMatchers, libLocalDefaultMatchers } = require('./config/matchers');

class ArcoWebpackPluginForReplaceDefaultLanguage {
  constructor(options) {
    this.options = merge(
      {
        defaultLanguage: '',
      },
      options
    );
  }

  apply(compiler) {
    if (!this.options.defaultLanguage) return;

    const loader = require.resolve('./loaders/replace-default-language');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource, esLocalDefaultMatchers) && !getLoader(module.loaders, loader)) {
        const loaders = cloneDeep(module.loaders || []);
        loaders.push({
          loader,
          options: {
            defaultLanguage: this.options.defaultLanguage,
            type: 'es',
          },
        });
        module.loaders = loaders;
      }
      if (isMatch(resource, libLocalDefaultMatchers) && !getLoader(module.loaders, loader)) {
        const loaders = cloneDeep(module.loaders || []);
        loaders.push({
          loader,
          options: {
            defaultLanguage: this.options.defaultLanguage,
            type: 'lib',
          },
        });
        module.loaders = loaders;
      }
    });
  }
}

module.exports = ArcoWebpackPluginForReplaceDefaultLanguage;
