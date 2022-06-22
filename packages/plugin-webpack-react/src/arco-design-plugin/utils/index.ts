import webpack, { Compiler, NormalModule } from 'webpack';
import { isObject, get, set } from 'lodash';
import { print } from '@arco-plugins/utils';
import { isAbsolute, join } from 'path';

/**
 * 获取指定路径的值，没有的时候将其设置为指定默认值
 * @param {object} src
 * @param {string} path
 * @param {function} checkFn
 * @param {any} defaultValue
 * @return {any}
 */
function getAndSetWhen(
  src: object,
  path: string,
  checkFn: (val: any) => boolean,
  defaultValue: any
) {
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
export function hookNormalModuleLoader(
  compiler: Compiler,
  pluginName: string,
  callback: (context: any, module: NormalModule, resource: string) => void
) {
  const hookHandler = (context, module) => {
    const { resource } = module;
    if (!resource) return;
    const i = resource.indexOf('?');
    callback(context, module, i < 0 ? resource : resource.substr(0, i));
  };
  const webpackImplementation =
    (global.arcoDesignPlugin.options.webpackImplementation as typeof webpack | undefined) ||
    webpack;
  compiler.hooks.compilation.tap(pluginName, (compilation) => {
    if (
      webpackImplementation.NormalModule &&
      webpackImplementation.NormalModule.getCompilationHooks
    ) {
      // for webpack 5
      webpackImplementation.NormalModule.getCompilationHooks(compilation).loader.tap(
        pluginName,
        hookHandler
      );
    } else if (compilation.hooks) {
      // for webpack 4
      compilation.hooks.normalModuleLoader.tap(pluginName, hookHandler);
    } else if ((compilation as any).plugin) {
      // for webpack 3
      (compilation as any).plugin('normal-module-loader', hookHandler);
    }
  });
}

/**
 * 返回指定的名称的loader配置
 * @param {loader[]} loaders
 * @param {string} loaderName
 * @returns {loader}
 */
export function getLoader(loaders, loaderName) {
  if (!Array.isArray(loaders) || !loaders.length) return;
  return loaders.find((item) => item.loader.indexOf(loaderName) > -1);
}

/**
 * 返回指定的名称的loader的位置
 * @param {loader[]} loaders
 * @param {string} loaderName
 * @returns {number}
 */
export function getLoaderIndex(loaders, loaderName) {
  if (!Array.isArray(loaders) || !loaders.length) return -1;
  return loaders.findIndex((item) => item.loader.indexOf(loaderName) > -1);
}

/**
 * 删除一个 babel 插件
 * @param {LoaderConfig} babelLoader
 * @param {Function} filterMethod
 */
export function deleteBabelPlugin(babelLoader, match) {
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
export function injectBabelPlugin(babelLoader, pluginOptions) {
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
export function rewriteLessLoaderOptions(lessLoader, options) {
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
export function printError(error) {
  if (error) {
    print.error(`[arco-design/webpack-plugin]: ${error}`);
  }
}

/**
 * 获取上下文的决对路径，默认为 compiler.context 即 webpackConfig.context
 * @param {Compiler} compiler
 * @returns {string}
 */
export function getContext(compiler: Compiler, context?: string) {
  if (!context) {
    return String(compiler.options.context);
  }

  if (!isAbsolute(context)) {
    return join(String(compiler.options.context), context);
  }

  return context;
}
