/* eslint-disable no-param-reassign */
import type { UserConfig } from 'vite';

import { reactLibraryName, vueLibraryName } from './const';
import { getThemeComponentList, isModExist } from './utils';

export type Vars = Record<string, any>;

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
              const globalList = [`${theme}/theme.less`];

              // arco base syle
              let reg = new RegExp(
                `(${reactLibraryName}|${vueLibraryName})/(es|lib)/style/index\\.less[^/]*$`
              );
              let matches = filename.match(reg);
              if (matches) {
                globalList.forEach((it) => {
                  src += `; @import '${it}';`;
                });
                return src;
              }

              // arco full style
              reg = new RegExp(
                `(${reactLibraryName}|${vueLibraryName})/dist/(css/index|arco)\\.less[^/]*$`
              );
              matches = filename.match(reg);
              if (matches) {
                const componentsLess = `${theme}/component.less`;
                if (isModExist(componentsLess)) {
                  globalList.push(componentsLess);
                }
                globalList.forEach((it) => {
                  src += `; @import '${it}';`;
                });
                return src;
              }

              // arco component style
              reg = new RegExp(
                `(${reactLibraryName}|${vueLibraryName})/es/([^/]+)/style/index\\.less[^/]*$`
              );
              matches = filename.match(reg);
              if (matches) {
                if (getThemeComponentList(theme).includes(matches[1])) {
                  src += `; @import '${theme}/components/${matches[1]}/index.less';`;
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
