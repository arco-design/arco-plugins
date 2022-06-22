import { cloneDeep } from 'lodash';
import { pathUtils } from '@arco-plugins/utils';
import { getLoader, hookNormalModuleLoader } from './utils';
import { PLUGIN_NAME } from './config';
import { esLocalDefaultMatchers, libLocalDefaultMatchers } from './config/matchers';
import { ArcoDesignPluginOptions } from './interface';

export class ReplaceDefaultLanguagePlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler) {
    if (!this.options.defaultLanguage) return;

    const loader = require.resolve('./loaders/replace-default-language');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (
        pathUtils.isMatch(resource, esLocalDefaultMatchers) &&
        !getLoader(module.loaders, loader)
      ) {
        const loaders = cloneDeep(module.loaders || []);
        loaders.push({
          loader,
          ident: null,
          type: null,
          options: {
            defaultLanguage: this.options.defaultLanguage,
            type: 'es',
          },
        });
        module.loaders = loaders;
      }
      if (
        pathUtils.isMatch(resource, libLocalDefaultMatchers) &&
        !getLoader(module.loaders, loader)
      ) {
        const loaders = cloneDeep(module.loaders || []);
        loaders.push({
          loader,
          ident: null,
          type: null,
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
