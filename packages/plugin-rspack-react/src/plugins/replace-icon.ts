import path from 'path';
import type { Compiler, RuleSetUseItem } from '@rspack/core';
import { compileGlob } from '../utils';
import { ArcoDesignPluginOptions } from '../types';

export class ReplaceIconPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const { iconBox } = this.options;
    if (!iconBox) return;
    let iconBoxLib: Record<string, string>;
    let iconBoxDirname: string;
    try {
      iconBoxDirname = path.dirname(require.resolve(`${iconBox}/package.json`));
      // eslint-disable-next-line import/no-dynamic-require, global-require
      iconBoxLib = require(iconBox);
    } catch (e) {
      const error = new Error(`IconBox ${iconBox} not existed`);
      error.cause = e;
      throw error;
    }
    const use: RuleSetUseItem = {
      loader: path.resolve(__dirname, './loaders/replace-icon.js'),
      options: {
        iconBoxLib,
        iconBoxDirname,
      },
    };
    compiler.options.module.rules.unshift({
      test: compileGlob('**/node_modules/@arco-design/web-react/icon/react-icon/*/index.js'),
      use: [use],
    });
  }
}
