import type { UserConfig } from 'vite';

import { fullLessMatchers, globalLessMatchers, componentLessMatchers } from './config';
import { getThemeComponentList, isModExist, pathMatch } from './utils';

type Vars = Record<string, any>;

// eslint-disable-next-line import/prefer-default-export
export function modifyCssConfig(config: UserConfig, theme: string, modifyVars: Vars) {
  config.css = config.css || {};
  const { preprocessorOptions = {} } = config.css;
  preprocessorOptions.less = preprocessorOptions.less || {};
  preprocessorOptions.less.javascriptEnabled = true;
  preprocessorOptions.less.modifyVars = preprocessorOptions.less.modifyVars || {};
  if (theme) {
    preprocessorOptions.less.modifyVars.hack = preprocessorOptions.less.modifyVars.hack || '';
    preprocessorOptions.less.modifyVars.hack += `; @import "${theme}/tokens.less";`;
    preprocessorOptions.less.plugins = preprocessorOptions.less.plugins || [];

    preprocessorOptions.less.plugins.push({
      install(_lessObj: any, pluginManager: any) {
        pluginManager.addPreProcessor(
          {
            process(src: string, extra: any) {
              const {
                fileInfo: { filename },
              } = extra;

              // theme global style
              const themeGlobalCss = `${theme}/theme.less`;

              // arco global syle
              let matches = pathMatch(filename, globalLessMatchers);
              if (matches) {
                src += `; @import '${themeGlobalCss}';`;
                return src;
              }

              // arco full style
              matches = pathMatch(filename, fullLessMatchers);
              if (matches) {
                const componentsLess = `${theme}/component.less`;
                const list = [themeGlobalCss];
                if (isModExist(componentsLess)) {
                  list.push(componentsLess);
                }
                list.forEach((it) => {
                  src += `; @import '${it}';`;
                });
                return src;
              }

              // arco component style
              const componentName = pathMatch(filename, componentLessMatchers);
              if (componentName) {
                if (getThemeComponentList(theme).includes(componentName)) {
                  src += `; @import '${theme}/components/${componentName}/index.less';`;
                }
              }
              return src;
            },
          },
          1000
        );
      },
    });
  }
  Object.assign(preprocessorOptions.less.modifyVars, modifyVars);
  config.css.preprocessorOptions = preprocessorOptions;
}
