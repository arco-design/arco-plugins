import { getFileSource } from '@arco-plugins/utils';
import type { Compiler, RuleSetUseItem } from '@rspack/core';
import path from 'path';
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
    this.handleGlobalStyle(compiler);
    this.handleComponentStyle(compiler);
  }

  handleGlobalStyle(compiler: Compiler) {
    if (!this.options.theme) return;
    this._addAppendLoader(
      compiler,
      `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/style/index.less`,
      `${this.options.theme}/theme.less`
    );
    this._addAppendLoader(
      compiler,
      `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/style/index.css`,
      `${this.options.theme}/theme.css`
    );
  }

  handleComponentStyle(compiler: Compiler) {
    if (!this.options.theme) return;
    const componentList = getThemeComponents(this.options.theme);
    componentList.forEach((name) => {
      this._addAppendLoader(
        compiler,
        `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/${name}/style/index.less`,
        `${this.options.theme}/components/${name}/index.less`
      );
      this._addAppendLoader(
        compiler,
        `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/${name}/style/index.css`,
        `${this.options.theme}/components/${name}/index.css`
      );
    });
  }

  _addAppendLoader(compiler: Compiler, glob: string, request: string) {
    const ext = path.extname(glob);
    let source = '';
    if (ext === '.css') {
      source = getFileSource(request);
    } else if (ext === '.less') {
      source = `;\n@import '~${request}';`;
    } else {
      throw new Error('Only accept to match css or less files.');
    }
    if (!source) return;
    const use: RuleSetUseItem = {
      loader: require.resolve('../loaders/append'),
      options: {
        additionContent: source.replace(/!/g, '__ARCO_PLACEHOLDER__'),
      },
    };
    compiler.options.module.rules.push({
      test: compileGlob(glob),
      type: undefined,
      use: [use],
    });
  }
}
