import type { Compiler } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } from '../config';
import { ArcoDesignPluginOptions } from '../types';

export class ImportPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    /**
     * Compatible with the new rspack version
     * due to since 0.63 removed options.builtins of compiler
     * https://github.com/web-infra-dev/rspack/releases/tag/v0.6.3
     */
    if (compiler.options.builtins) {
      compiler.options.builtins.pluginImport ||= [];

      compiler.options.builtins.pluginImport.push({
        libraryDirectory: this.options.libraryDirectory || 'es',
        style: this.options.style ?? true,
        libraryName: ARCO_DESIGN_COMPONENT_NAME,
        camelToDashComponentName: false,
      });

      compiler.options.builtins.pluginImport.push({
        libraryName: ARCO_DESIGN_ICON_NAME,
        libraryDirectory: 'react-icon',
        camelToDashComponentName: false,
      });

      if (this.options.iconBox) {
        compiler.options.builtins.pluginImport.push({
          libraryName: this.options.iconBox,
          libraryDirectory: 'esm',
          camelToDashComponentName: false,
        });
      }
    } else {
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
}

exports.ImportPlugin = ImportPlugin;
