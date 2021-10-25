const micromatch = require('micromatch');
const { isObject, get, set } = require('lodash');
const NormalModule = require('webpack/lib/NormalModule');
const print = require('./print');

/**
 * 获取指定路径的值，没有的时候将其设置为指定默认值
 * @param {object} src
 * @param {string} path
 * @param {function} checkFn
 * @param {any} defaultValue
 * @return {any}
 */
function getAndSetWhen(src, path, checkFn, defaultValue) {
  if (!isObject(src)) return;
  const res = get(src, path);

  if (!checkFn(res)) {
    set(src, path, defaultValue);
    return get(src, path);
  }

  return res;
}

/**
 * 勾入 normalModuleLoader
 * @param {Compiler} compiler
 * @param {string} pluginName
 * @param {Function} callback
 */
function hookNormalModuleLoader(compiler, pluginName, callback) {
  const hookHandler = (context, module) => {
    const { resource } = module;
    if (!resource) return;
    const i = resource.indexOf('?');
    callback(context, module, i < 0 ? resource : resource.substr(0, i));
  };
  compiler.hooks.compilation.tap(pluginName, (compilation) => {
    if (NormalModule.getCompilationHooks) {
      // for webpack 5
      NormalModule.getCompilationHooks(compilation).loader.tap(pluginName, hookHandler);
    } else if (compilation.hooks) {
      // for webpack 4
      compilation.hooks.normalModuleLoader.tap(pluginName, hookHandler);
    } else if (compilation.plugin) {
      // for webpack 3
      compilation.plugin('normal-module-loader', hookHandler);
    }
  });
}

/**
 * 返回指定的名称的loader配置
 * @param {loader[]} loaders
 * @param {string} loaderName
 * @returns {loader}
 */
function getLoader(loaders, loaderName) {
  if (!Array.isArray(loaders) || !loaders.length) return;
  return loaders.find((item) => item.loader.indexOf(loaderName) > -1);
}

/**
 * 删除一个 babel 插件
 * @param {LoaderConfig} babelLoader
 * @param {Function} filterMethod
 */
function deleteBabelPlugin(babelLoader, match) {
  if (!babelLoader) return;

  const plugins = get(babelLoader, 'options.plugins');
  if (!plugins) return;

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    if (match(plugin)) {
      plugins.splice(i, 1);
      i--;
    }
  }
}

/**
 * 插入一个 babel 插件
 * @param {LoaderConfig} babelLoader
 * @param {loader plugin options} pluginOptions
 */
function injectBabelPlugin(babelLoader, pluginOptions) {
  if (!babelLoader) return;

  const plugins = getAndSetWhen(babelLoader, 'options.plugins', Array.isArray, []);
  const pluginOptionsName = pluginOptions[2];

  if (plugins.every((plugin) => plugin[2] !== pluginOptionsName)) {
    plugins.push(pluginOptions);
  }
}

/**
 * 给 less-loader 加上主题变量
 * @param {loaderConfig} lessLoader
 * @param {lessLoader.options} options
 */
function rewriteLessLoaderOptions(lessLoader, options) {
  if (!lessLoader) return;

  // less-loader 6.0 之后 less 的配置放到了 options.lessOptions。这边简单的通过判断原本的配置中是否存在 lessOptions 来决定用谁
  const useLessOptions = !!get(lessLoader, 'options.lessOptions');
  const lessOptions = getAndSetWhen(
    lessLoader,
    useLessOptions ? 'options.lessOptions' : 'options',
    isObject,
    {}
  );
  Object.assign(lessOptions, options);
}

/**
 * 打印错误信息
 */
function printError(error) {
  if (error) {
    print.error(`[arco-design/webpack-plugin]: ${error}`);
  }
}

/**
 * 返回是否文件路径匹配
 * @param {string} resource
 * @param {string} fileMatchers
 * @returns boolean
 */
function isMatch(resource, fileMatchers) {
  // 因为 resource中含有 . 符号时候默认会忽略匹配，所以设置 dot: true
  return micromatch.isMatch(resource, fileMatchers, { dot: true });
}

module.exports = {
  getLoader,
  hookNormalModuleLoader,
  injectBabelPlugin,
  deleteBabelPlugin,
  rewriteLessLoaderOptions,
  printError,
  isMatch,
};
