import type { UserConfig } from 'vite';
import { writeFileSync } from 'fs';
import { lessMatchers, globalLessMatchers, componentLessMatchers } from './config';
import { getThemeComponentList, pathMatch, readFileStrSync, parseInclude2RegExp } from './utils';

type Vars = Record<string, any>;

// eslint-disable-next-line import/prefer-default-export
export function modifyCssConfig(
  pkgName: string,
  config: UserConfig,
  theme: string,
  modifyVars: Vars,
  varsInjectScope: (string | RegExp)[]
) {
  let modifyLess: string | boolean = '';
  if (theme) {
    modifyLess = readFileStrSync(`${theme}/tokens.less`);
    if (modifyLess === false) {
      throw new Error(`Theme ${theme} not existed`);
    }
  }
  Object.entries(modifyVars).forEach(([k, v]) => {
    modifyLess += `@${k}:${v};`;
  });

  config.css = config.css || {};
  config.css.preprocessorOptions = config.css.preprocessorOptions || {};

  const { preprocessorOptions } = config.css;
  preprocessorOptions.less = preprocessorOptions.less || {};
  preprocessorOptions.less.javascriptEnabled = true;
  if (modifyLess) {
    writeFileSync(`${__dirname}/../../.tokens.less`, modifyLess, {
      flag: 'w',
    });
    const modifyLessFile = `${pkgName}/.tokens.less`;
    const includeRegExp = parseInclude2RegExp(varsInjectScope);
    preprocessorOptions.less.plugins = preprocessorOptions.less.plugins || [];
    preprocessorOptions.less.plugins.push({
      install(_lessObj: any, pluginManager: any) {
        pluginManager.addPreProcessor(
          {
            process(src: string, extra: any) {
              const {
                fileInfo: { filename },
              } = extra;

              // arco less vars inject
              const varsInjectMatch =
                pathMatch(filename, lessMatchers) ||
                (includeRegExp && pathMatch(filename, [includeRegExp]));
              if (!varsInjectMatch) return src;

              if (theme) {
                // arco global style
                const globalMatch = pathMatch(filename, globalLessMatchers);
                if (globalMatch) {
                  src += `; @import '${theme}/theme.less';`;
                }

                // arco component style
                const componentName = pathMatch(filename, componentLessMatchers);
                if (componentName) {
                  if (getThemeComponentList(theme).includes(componentName)) {
                    src += `; @import '${theme}/components/${componentName}/index.less';`;
                  }
                }
              }

              src += `; @import '${modifyLessFile}';`;

              return src;
            },
          },
          1000
        );
      },
    });
  }
}
