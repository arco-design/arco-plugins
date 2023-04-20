/* eslint-disable no-empty */
import path from 'path';
import { readFileSync, readdirSync } from 'fs';
import { cloneDeep, isString, isEmpty } from 'lodash';
import { print, getFileSource, pathUtils } from '@arco-plugins/utils';
import { Compiler } from 'webpack';
import { getLoader, hookNormalModuleLoader, rewriteLessLoaderOptions, getContext } from './utils';
import { PLUGIN_NAME } from './config';
import {
  globalLessMatchers,
  globalCssMatchers,
  componentCssMatchers,
  componentLessMatchers,
  lessMatchers,
} from './config/matchers';
import { ArcoDesignPluginOptions } from './interface';

export class ThemePlugin {
  options: ArcoDesignPluginOptions;
  compiler: Compiler;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler) {
    this.compiler = compiler;
    this.hookForGlobalStyle();
    this.hookForVariables();
    this.hookForComponentStyle();
  }

  /**
   * 读取主题变量，添加到 less-loader
   */
  hookForVariables() {
    const themeVars = this.getThemeVars() || {};
    const modifyVars = this.options.modifyVars || {};
    const vars = { ...themeVars, ...modifyVars };
    if (isEmpty(vars)) return;

    let noLessLoaderWarning = '';
    const context = getContext(this.compiler, this.options.context);
    const include = this.options.varsInjectScope || [];
    const isMatch = pathUtils.matcher(include, {
      extraGlobPattern: lessMatchers,
      extensions: ['.less'],
      cwd: context,
    });

    hookNormalModuleLoader(this.compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
      if (isMatch(resource)) {
        const loaders = cloneDeep(module.loaders);
        const lessLoader = getLoader(loaders, 'less-loader');

        if (!lessLoader) {
          noLessLoaderWarning =
            'less-loader not found! The theme and modifyVars has no effective, please check if less-loader is added.';
          return;
        }

        rewriteLessLoaderOptions(lessLoader, {
          modifyVars: vars,
        });

        module.loaders = loaders;
      }
    });

    this.compiler.hooks.afterCompile.tap(PLUGIN_NAME, () => {
      if (noLessLoaderWarning) {
        print.warn(`[arco-design/webpack-plugin]: ${noLessLoaderWarning}`);
      }
    });
  }

  /**
   * 读取主题全局样式文件，利用 loader 添加到 `@arco-design/web-react/{es,lib}/style/index.{css,less}`
   */
  hookForGlobalStyle() {
    if (!this.options.theme) return;
    this.addAppendLoader(globalLessMatchers, `${this.options.theme}/theme.less`, {
      importLessPath: true,
    });
    this.addAppendLoader(globalCssMatchers, `${this.options.theme}/theme.css`);
  }

  /**
   * 读取组件的样式文件，附加到各组件的 index.less 和 index.css
   */
  hookForComponentStyle() {
    if (!this.options.theme) return;

    const componentList = this.getComponentList();
    componentList.forEach((componentName) => {
      this.addAppendLoader(
        componentLessMatchers(componentName),
        `${this.options.theme}/components/${componentName}/index.less`,
        {
          importLessPath: true,
        }
      );
      this.addAppendLoader(
        componentCssMatchers(componentName),
        `${this.options.theme}/components/${componentName}/index.css`
      );
    });
  }

  /**
   * 将 filePath 中的内容添加到 match 的文件中
   * @param matcher
   * @param filePath
   * @param options
   * @returns
   */
  addAppendLoader(matcher, filePath, options?: { importLessPath?: boolean }) {
    try {
      let source: string;
      if (options?.importLessPath) {
        if (!source) return;
        source = `;\n@import '~${filePath}';`;
      } else {
        source = getFileSource(filePath);
        if (!source) return;
      }

      const appendLoader = require.resolve('./loaders/append');
      hookNormalModuleLoader(this.compiler, PLUGIN_NAME, (_loaderContext, module, resource) => {
        if (pathUtils.isMatch(resource, matcher) && !getLoader(module.loaders, appendLoader)) {
          const loaders = cloneDeep(module.loaders || []);
          loaders.push({
            loader: appendLoader,
            options: {
              additionContent: source.replace(/!/g, '__ARCO_PLACEHOLDER__'),
            },
            ident: null,
            type: null,
          });
          module.loaders = loaders;
        }
      });
    } catch (error) {}
  }

  /** 读取组件配置目录 */
  getComponentList() {
    if (!this.options.theme) return [];
    try {
      const packageRootDir = path.dirname(require.resolve(`${this.options.theme}/package.json`));
      const themeComponentDirPath = `${packageRootDir}/components`;
      const componentList = readdirSync(themeComponentDirPath);
      return componentList || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * 读取主题变量
   */
  getThemeVars() {
    if (!this.options.theme) return {};
    try {
      const variableLessPath = require.resolve(`${this.options.theme}/tokens.less`);
      const source = readFileSync(variableLessPath);
      return this.transformSourceToObject(source.toString());
    } catch (error) {
      return {};
    }
  }

  /**
   * 将文件内容转为对象
   * @param {less file content}} source
   */
  transformSourceToObject(source = '') {
    // 去掉注释
    const str =
      isString(source) &&
      source
        .replace(/\/\/.*/g, '') // ‘//’ 之后的所有内容（以一行为结束）
        .replace(/\/\*[\s\S]*?\*\//g, ''); // ‘/**/’ 之间的所有内容
    if (!str.length) return;

    const obj = {};
    str
      .match(/(?=@)([\s\S]+?)(?=;)/g) // 匹配变量定义，结果为 ‘@变量名: 变量值’
      .map((item) => item && item.split(':'))
      .filter((item) => item && item.length === 2)
      .forEach((item) => {
        const key = item[0].replace(/^@/, '').trim();
        const value = item[1].trim();
        if (key && value) {
          obj[key] = value;
        }
      });

    return obj;
  }
}
