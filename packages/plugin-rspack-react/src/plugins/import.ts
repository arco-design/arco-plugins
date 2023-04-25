import type { Compiler } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } from '../config';
import { ArcoDesignPluginOptions } from '../types';

export class ImportPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
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
  }
}
