import type { Plugin, ResolvedConfig, UserConfig, ConfigEnv } from 'vite';

import { reactLibraryName, vueLibraryName } from './const';
import { modifyCssConfig, Vars } from './less';
import { transformCssFile, transformJsFiles } from './transform';

import pkg from '../package.json';

type Style = boolean | 'css';
interface PluginOption {
  theme?: string; // Theme package name
  iconBox?: string; // Icon library package name
  modifyVars?: Vars; // less modifyVars
  style?: Style; // Style lazy load
}

export default function vitePluginArcoImport(options: PluginOption = {}): Plugin {
  const { theme = '', iconBox = '', modifyVars = {}, style = true } = options;
  let styleOptimization: boolean;
  let iconBoxLib: any;
  let resolvedConfig: ResolvedConfig;
  let isDevelopment = false;

  if (iconBox) {
    try {
      iconBoxLib = require(iconBox); // eslint-disable-line
    } catch (e) {
      console.error(`IconBox ${iconBox} not existed`);
    }
  }
  return {
    name: pkg.name,
    config(config: UserConfig, { command }: ConfigEnv) {
      isDevelopment = command === 'serve';
      // Lay load
      styleOptimization = command === 'build';

      // css preprocessorOptions
      modifyCssConfig(config, theme, modifyVars);

      // iconbox
      if (iconBoxLib) {
        // eslint-disable-next-line no-param-reassign
        config.optimizeDeps = config.optimizeDeps || {};
        // eslint-disable-next-line no-param-reassign
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
        if (!config.optimizeDeps.exclude.includes(`${reactLibraryName}/icon`)) {
          config.optimizeDeps.exclude.push(`${reactLibraryName}/icon`);
        }
        if (!config.optimizeDeps.exclude.includes(`${vueLibraryName}/icon`)) {
          config.optimizeDeps.exclude.push(`${vueLibraryName}/icon`);
        }
      }
    },
    async load(id: string) {
      // replace arco icons
      let reg = new RegExp(`${reactLibraryName}/icon/react-icon/([^/]+)/index\\.js[^/]*$`);
      let matches = id.match(reg);
      if (matches && iconBoxLib?.[matches[1]]) {
        return `export { default } from  '${iconBox}/esm/${matches[1]}/index.js'`;
      }

      reg = new RegExp(`${vueLibraryName}/es/icon/([^/]+)/index\\.js[^/]*$`);
      matches = id.match(reg);
      if (matches && iconBoxLib?.[matches[1]]) {
        return `export { default } from  '${iconBox}/esm/${matches[1]}/index.js'`;
      }

      // other ids should be handled as usually
      return null;
    },
    configResolved(config: ResolvedConfig) {
      resolvedConfig = config;
      // console.log('viteConfig', resolvedConfig)
    },
    transform(code, id) {
      // transform css files
      const res = transformCssFile({
        code,
        id,
        theme,
      });
      if (res !== undefined) {
        return res;
      }

      // css lazy load
      return transformJsFiles({
        code,
        id,
        theme,
        style,
        styleOptimization,
        sourceMaps: isDevelopment || Boolean(resolvedConfig?.build?.sourcemap),
      });
    },
  };
}
