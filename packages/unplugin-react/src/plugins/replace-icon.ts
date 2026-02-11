import fs from 'fs';
import path from 'path';
import type { Compiler } from '@rspack/core';
import { compileGlob } from '../utils';
import { ArcoDesignPluginOptions } from '../types';
import { ARCO_DESIGN_ICON_NAME, PLUGIN_NAME } from '../config';

export class ReplaceIconPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const { iconBox } = this.options;
    if (!iconBox) return;
    let validIcons: Set<string>;
    let iconBoxDirname: string;
    try {
      iconBoxDirname = path.dirname(require.resolve(`${iconBox}/package.json`));
      // eslint-disable-next-line import/no-dynamic-require, global-require
      validIcons = new Set(fs.readdirSync(path.resolve(iconBoxDirname, 'esm')));
    } catch (e) {
      const error = new Error(`IconBox ${iconBox} not existed`);
      error.cause = e;
      throw error;
    }
    if (!validIcons.size) throw new Error(`No icons found in ${iconBox}`);

    const suffix = '/index.js';
    const suffixLength = suffix.length;
    const re = compileGlob(`**/node_modules/${ARCO_DESIGN_ICON_NAME}/react-icon/*/index.js`);

    compiler.hooks.normalModuleFactory.tap(`${PLUGIN_NAME}:Icon`, (nmf) => {
      nmf.hooks.afterResolve.tap(`${PLUGIN_NAME}:Icon`, (resolveData) => {
        const resource = resolveData.createData?.resource;
        if (!resource || !re.test(resource)) return;
        const iconNameIndex = resource.lastIndexOf('/', resource.length - suffixLength - 1);
        const iconName = resource.slice(iconNameIndex + 1, -suffixLength);
        if (validIcons.has(iconName)) {
          resolveData.createData!.resource = path.resolve(
            iconBoxDirname,
            'esm',
            iconName,
            'index.js'
          );
        }
      });
    });
  }
}
