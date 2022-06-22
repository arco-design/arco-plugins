import { cloneDeep } from 'lodash';
import { pathUtils } from '@arco-plugins/utils';
import { getLoader, hookNormalModuleLoader } from './utils';
import { PLUGIN_NAME } from './config';
import { globalLessMatchers } from './config/matchers';

export class RemoveFontFacePlugin {
  apply(compiler) {
    const loader = require.resolve('./loaders/remove-font-face');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (pathUtils.isMatch(resource, globalLessMatchers) && !getLoader(module.loaders, loader)) {
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
