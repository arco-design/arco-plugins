import type { Compiler } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME } from '../config';
import { ArcoDesignPluginOptions } from '../types';
import { compileGlob } from '../utils';
import { getThemeComponents } from '../utils/theme';

export class ThemePlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.options.module.rules.push({
      test: compileGlob(
        `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}{/*,}/style/index.{css,less}`
      ),
      type: undefined,
      use: [
        {
          loader: require.resolve('../loaders/append'),
          options: {
            theme: this.options.theme,
            components: new Set(getThemeComponents(this.options.theme)),
          },
        },
      ],
    });
  }
}
