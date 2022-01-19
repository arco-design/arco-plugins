import type { UserConfig } from 'vite';
import type { PluginBuild, OnLoadArgs } from 'esbuild';

import { iconListMatchers, iconComponentMatchers, libraryName } from './config';
import { pathMatch } from './utils';

const filter = new RegExp(`${libraryName}/icon/react-icon/([^/]+)/index\\.js$`);

export function loadIcon(id: string, iconBox: string, iconBoxLib: any) {
  if (!iconBox || !iconBoxLib) {
    return;
  }

  const componentName = pathMatch(id, iconComponentMatchers);
  if (componentName && iconBoxLib[componentName]) {
    return `export { default } from  '${iconBox}/esm/${componentName}/index.js'`;
  }

  // cjs -> es
  if (pathMatch(id, iconListMatchers)) {
    return `export * from  './index.es.js'`;
  }
}

export function modifyIconConfig(config: UserConfig, iconBox: string, iconBoxLib: any) {
  if (!iconBox || !iconBoxLib) {
    return;
  }

  config.optimizeDeps = config.optimizeDeps || {};

  // Avoid Dependency Pre-Bundling
  config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
  if (!config.optimizeDeps.exclude.includes(`${libraryName}/icon`)) {
    config.optimizeDeps.exclude.push(`${libraryName}/icon`);
  }
  // Built-in Icon
  config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {};
  config.optimizeDeps.esbuildOptions.plugins = config.optimizeDeps.esbuildOptions.plugins || [];
  config.optimizeDeps.esbuildOptions.plugins.push({
    name: 'arcoIconReplace',
    setup(build: PluginBuild) {
      build.onLoad(
        {
          namespace: 'file',
          filter,
        },
        ({ path: id }: OnLoadArgs) => {
          const contents = loadIcon(id, iconBox, iconBoxLib);
          if (contents) {
            return {
              contents,
              loader: 'js',
            };
          }
          return null;
        }
      );
    },
  });
}
