import type { Compiler, RuleSetUseItem } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME } from '../config';
import { compileGlob } from '../utils';
import { ArcoDesignPluginOptions } from '../types';

export class ReplaceDefaultLanguagePlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    for (const type of ['es', 'lib']) {
      const use: RuleSetUseItem = {
        loader: require.resolve('../loaders/replace-default-language'),
        options: {
          defaultLanguage: this.options.defaultLanguage,
          type,
        },
      };
      compiler.options.module.rules.push({
        test: compileGlob(
          `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/${type}/locale/default.js`
        ),
        type: null,
        use: [use],
      });
    }
  }
}
