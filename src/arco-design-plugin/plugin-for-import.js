const { isAbsolute, join } = require('path');
const { merge, isArray } = require('lodash');
const arrify = require('./utils/arrify');
const { parseFiles, parseFoldersToGlobs } = require('./utils/glob');
const print = require('./utils/print');

const {
  getLoader,
  hookNormalModuleLoader,
  deleteBabelPlugin,
  injectBabelPlugin,
  isMatch,
} = require('./utils');
const { PLUGIN_NAME, ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } = require('./config');

/**
 * 给匹配的文件的 babel-loader 增加 babel-plugin-import
 */

class ArcoWebpackPluginForImport {
  constructor(options) {
    this.options = merge(
      {
        include: ['src'],
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        style: true,
        iconBox: '',
      },
      options
    );

    const babelPluginImport = require.resolve('babel-plugin-import');

    // 新增组件库配置
    this.babelPlugins = [
      [
        babelPluginImport,
        {
          libraryName: ARCO_DESIGN_COMPONENT_NAME,
          libraryDirectory: 'es',
          camel2DashComponentName: false,
          style: this.options.style === 'css' ? 'css' : !!this.options.style,
        },
        `__arco_webpack_plugin__${ARCO_DESIGN_COMPONENT_NAME}`,
      ],
      [
        babelPluginImport,
        {
          libraryName: ARCO_DESIGN_ICON_NAME,
          libraryDirectory: 'react-icon',
          camel2DashComponentName: false,
        },
        `__arco_webpack_plugin__${ARCO_DESIGN_ICON_NAME}`,
      ],
    ];

    // 新增图标配置
    if (this.options.iconBox) {
      this.babelPlugins.push([
        babelPluginImport,
        {
          libraryName: this.options.iconBox,
          libraryDirectory: 'esm', // 图标库默认文件夹
          camel2DashComponentName: false,
        },
        `__arco_webpack_plugin__${this.options.iconBox}`,
      ]);
    }
  }

  apply(compiler) {
    const include = parseFiles(this.options.include, this.getContext(compiler));
    const extensions = arrify(this.options.extensions);
    const fileMatchers = parseFoldersToGlobs(include, extensions);
    let noBabelLoaderWarning = '';

    hookNormalModuleLoader(compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource, fileMatchers)) {
        const loaders = module.loaders;

        const babelLoader = getLoader(loaders, 'babel-loader');

        if (!babelLoader) {
          noBabelLoaderWarning =
            'babel-loader not found! Import on demand has no effective, please check if babel-loader is added.';
          return;
        }

        // 删除原有配置
        deleteBabelPlugin(babelLoader, (plugin) => {
          if (!isArray(plugin)) return;
          const pluginName = plugin[0];
          const { libraryName } = plugin[1] || {};
          return (
            (pluginName === 'import' || pluginName === 'babel-plugin-import') &&
            (libraryName === ARCO_DESIGN_COMPONENT_NAME || libraryName === ARCO_DESIGN_ICON_NAME)
          );
        });
        this.babelPlugins.forEach((plugin) => {
          injectBabelPlugin(babelLoader, plugin);
        });
        module.loaders = loaders;
      }
    });

    compiler.hooks.afterCompile.tap(PLUGIN_NAME, () => {
      if (noBabelLoaderWarning) {
        print.warn(`[arco-design/webpack-plugin]: ${noBabelLoaderWarning}`);
      }
    });
  }

  /**
   * 获取上下文的决对路径，默认为 compiler.context 即 webpackConfig.context
   * @param {Compiler} compiler
   * @returns {string}
   */
  getContext(compiler) {
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

module.exports = ArcoWebpackPluginForImport;
