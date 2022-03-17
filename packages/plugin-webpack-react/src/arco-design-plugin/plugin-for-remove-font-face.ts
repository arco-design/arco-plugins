import { cloneDeep } from 'lodash';
import { getLoader, hookNormalModuleLoader, isMatch } from './utils';
import { PLUGIN_NAME } from './config';
import { globalLessMatchers } from './config/matchers';

export class RemoveFontFacePlugin {
  apply(compiler) {
    const loader = require.resolve('./loaders/remove-font-face');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource, globalLessMatchers) && !getLoader(module.loaders, loader)) {
        const loaders = cloneDeep(module.loaders || []);
        loaders.push({
          loader,
          ident: null,
          type: null,
          options: {},
        });
        module.loaders = loaders;
      }
    });
  }
}
