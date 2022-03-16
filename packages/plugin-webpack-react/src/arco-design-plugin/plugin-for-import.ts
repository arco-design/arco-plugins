import { isAbsolute, join } from 'path';
import { merge } from 'lodash';
import { arrify, glob } from '@arco-plugins/utils';
import { Compiler } from 'webpack';
import { getBabelPlugins } from './utils/transform-import';
import { getLoader, hookNormalModuleLoader, isMatch, getLoaderIndex } from './utils';
import { PLUGIN_NAME } from './config';

const { parseFiles, parseFoldersToGlobs } = glob;

interface ImportPluginOptions {
  context?: string;
  include: string[];
  extensions: string[];
  style: string | boolean;
  libraryDirectory: string;
  iconBox: string;
  babelConfig: object;
}

/**
 * 给匹配的文件的 babel-loader 增加 babel-plugin-import
 */
export class ImportPlugin {
  options: ImportPluginOptions;

  babelPlugins: any[];

  constructor(options: Partial<ImportPluginOptions>) {
    this.options = merge(
      {
        include: ['src'],
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        style: true,
        libraryDirectory: 'es',
        iconBox: '',
        babelConfig: {},
      },
      options
    );

    this.babelPlugins = getBabelPlugins(this.options);
  }

  apply(compiler: Compiler) {
    const include = parseFiles(this.options.include, this.getContext(compiler));
    const extensions = arrify(this.options.extensions);
    const fileMatchers = parseFoldersToGlobs(include, extensions);

    const loader = require.resolve('./loaders/transform-import');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource, fileMatchers) && !getLoader(module.loaders, loader)) {
        const loaders = module.loaders;
        const babelLoaderIndex = getLoaderIndex(loaders, 'babel-loader');
        const tsLoaderIndex = getLoaderIndex(loaders, 'ts-loader');
        let insertIndex = loaders.length - 1;
        if (babelLoaderIndex > -1) {
          insertIndex = babelLoaderIndex + 1;
        } else if (tsLoaderIndex > -1) {
          insertIndex = (tsLoaderIndex || 1) - 1;
        }
        loaders.splice(insertIndex, 0, {
          loader,
          options: {
            style: this.options.style,
            libraryDirectory: this.options.libraryDirectory,
            iconBox: this.options.iconBox,
            babelConfig: this.options.babelConfig,
          },
          ident: null,
          type: null,
        });
        module.loaders = loaders;
      }
    });
  }

  /**
   * 获取上下文的决对路径，默认为 compiler.context 即 webpackConfig.context
   * @param {Compiler} compiler
   * @returns {string}
   */
  getContext(compiler: Compiler) {
    if (!this.options.context) {
      return String(compiler.options.context);
    }

    if (!isAbsolute(this.options.context)) {
      return join(String(compiler.options.context), this.options.context);
    }

    return this.options.context;
  }

  getBabelPlugins() {
    return this.babelPlugins.slice(0);
  }
}
