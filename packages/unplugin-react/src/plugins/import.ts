import type { Compiler } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } from '../config';
import { ArcoDesignPluginOptions } from '../types';

export class ImportPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.options.module.rules ||= [];

    const rule = {
      test: /@arco-design\/web-react/,
      exclude: [/node_modules/],
      loader: 'builtin:swc-loader',
      options: {
        rspackExperiments: {
          import: [
            {
              libraryDirectory: this.options.libraryDirectory || 'es',
              style: ![null, undefined].includes(this.options.style) ? this.options.style : true,
              libraryName: ARCO_DESIGN_COMPONENT_NAME,
              camelToDashComponentName: false,
            },
            {
              libraryName: ARCO_DESIGN_ICON_NAME,
              libraryDirectory: 'react-icon',
              camelToDashComponentName: false,
            },
            {
              libraryName: this.options.iconBox,
              libraryDirectory: 'esm',
              camelToDashComponentName: false,
            },
          ],
        },
      },
    };

    compiler.options.module.rules.push(rule);
  }
}

exports.ImportPlugin = ImportPlugin;
