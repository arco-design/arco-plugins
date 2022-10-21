import { arrify, pathUtils } from '@arco-plugins/utils';
import { Compiler } from 'webpack';
import { getBabelPlugins, modifyBabelLoader } from './utils/transform-import';
import { getLoader, hookNormalModuleLoader, getLoaderIndex, getContext } from './utils';
import { PLUGIN_NAME } from './config';
import { ArcoDesignPluginOptions } from './interface';
/**
 * 给匹配的文件的 babel-loader 增加 babel-plugin-import
 */
export class ImportPlugin {
  options: ArcoDesignPluginOptions;

  babelPlugins: any[];

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
    this.babelPlugins = getBabelPlugins(this.options);
  }

  apply(compiler: Compiler) {
    const { include } = this.options;
    const context = getContext(compiler, this.options.context);
    const extensions = arrify(this.options.extensions);
    const isMatch = pathUtils.matcher(include, { extensions, cwd: context });
    const loader = require.resolve('./loaders/transform-import');
    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource) && !getLoader(module.loaders, loader)) {
        const loaders = module.loaders;
        const babelLoaderIndex = getLoaderIndex(loaders, 'babel-loader');
        const tsLoaderIndex = getLoaderIndex(loaders, 'ts-loader');
        const shouldModifyBabelLoader = this.options.modifyBabelLoader ?? babelLoaderIndex > -1;
        const options = {
          style: this.options.style,
          libraryDirectory: this.options.libraryDirectory,
          iconBox: this.options.iconBox,
          babelConfig: this.options.babelConfig,
        };
        if (shouldModifyBabelLoader) {
          modifyBabelLoader(loaders[babelLoaderIndex], options);
          return;
        }
        let insertIndex = loaders.length - 1;
        if (babelLoaderIndex > -1) {
          insertIndex = babelLoaderIndex + 1;
        } else if (tsLoaderIndex > -1) {
          insertIndex = (tsLoaderIndex || 1) - 1;
        }
        loaders.splice(insertIndex, 0, {
          loader,
          options,
          ident: null,
          type: null,
        });
        module.loaders = loaders;
      }
    });
  }

  getBabelPlugins() {
    return this.babelPlugins.slice(0);
  }
}
