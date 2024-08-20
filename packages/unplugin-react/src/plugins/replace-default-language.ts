import { Compiler, rspack } from '@rspack/core';
import { makeRe } from 'minimatch';
import { ARCO_DESIGN_COMPONENT_NAME } from '../config';
import { ArcoDesignPluginOptions } from '../types';

function replaceLanguage(originPath: string, language: string) {
  return originPath.replace(
    /default(\.js)?$/,
    language.endsWith('.js') ? language : `${language}.js`
  );
}

export class ReplaceDefaultLanguagePlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    new rspack.NormalModuleReplacementPlugin(
      makeRe(`**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/locale/default.js`) as RegExp,
      (result) => {
        result.request = replaceLanguage(result.request, this.options.defaultLanguage);
        if (result.createData.resource) {
          result.createData.resource = replaceLanguage(
            result.createData.resource,
            this.options.defaultLanguage
          );
        }
      }
    ).apply(compiler);
  }
}
