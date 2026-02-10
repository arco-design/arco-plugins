import type { Compiler, SwcLoaderOptions } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } from '../config';
import { ArcoDesignPluginOptions } from '../types';
import { patchLoaderOptions } from '../utils/theme';

function applySwcOptions(
  options: ArcoDesignPluginOptions,
  ruleOptions: string | Record<string, any>,
  externals: string[]
) {
  if (typeof ruleOptions !== 'object') return;
  const swcLoaderOptions = ruleOptions as SwcLoaderOptions;
  swcLoaderOptions.rspackExperiments ||= {};
  swcLoaderOptions.rspackExperiments.import ||= [];

  if (!externals.includes(ARCO_DESIGN_COMPONENT_NAME)) {
    swcLoaderOptions.rspackExperiments.import.push({
      libraryDirectory: options.libraryDirectory || 'es',
      style: options.style ?? true,
      libraryName: ARCO_DESIGN_COMPONENT_NAME,
      camelToDashComponentName: false,
    });
  }

  if (!externals.includes(ARCO_DESIGN_ICON_NAME)) {
    swcLoaderOptions.rspackExperiments.import.push({
      libraryName: ARCO_DESIGN_ICON_NAME,
      libraryDirectory: 'react-icon',
      camelToDashComponentName: false,
    });
  }

  if (options.iconBox && !externals.includes(options.iconBox)) {
    swcLoaderOptions.rspackExperiments.import.push({
      libraryName: options.iconBox,
      customName: `${options.iconBox}/esm/{{member}}`,
    });
  }
}

export class ImportPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const externals = Object.keys(compiler?.options?.externals ?? {});
    /**
     * Compatible with the new rspack version
     * due to since 0.63 removed options.builtins of compiler
     * https://github.com/web-infra-dev/rspack/releases/tag/v0.6.3
     */
    // @ts-expect-error removed
    if (compiler.options.builtins) {
      // @ts-expect-error removed
      compiler.options.builtins.pluginImport ||= [];

      if (!externals.includes(ARCO_DESIGN_COMPONENT_NAME)) {
        // @ts-expect-error removed
        compiler.options.builtins.pluginImport.push({
          libraryDirectory: this.options.libraryDirectory || 'es',
          style: this.options.style ?? true,
          libraryName: ARCO_DESIGN_COMPONENT_NAME,
          camelToDashComponentName: false,
        });
      }

      if (!externals.includes(ARCO_DESIGN_ICON_NAME)) {
        // @ts-expect-error removed
        compiler.options.builtins.pluginImport.push({
          libraryName: ARCO_DESIGN_ICON_NAME,
          libraryDirectory: 'react-icon',
          camelToDashComponentName: false,
        });
      }

      if (this.options.iconBox && !externals.includes(this.options.iconBox)) {
        // @ts-expect-error removed
        compiler.options.builtins.pluginImport.push({
          libraryName: this.options.iconBox,
          libraryDirectory: 'esm',
          camelToDashComponentName: false,
        });
      }
    } else {
      compiler.options.module.rules ||= [];

      const rules = compiler.options.module.rules;

      patchLoaderOptions(rules, 'builtin:swc-loader', (options) => {
        applySwcOptions(this.options, options, externals);
      });
    }
  }
}
