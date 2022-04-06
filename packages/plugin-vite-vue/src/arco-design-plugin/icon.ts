import type { UserConfig } from 'vite';
import type { PluginBuild, OnLoadArgs } from 'esbuild';

import { iconCjsListMatchers, iconComponentMatchers } from './config';
import { pathMatch } from './utils';

const filter = new RegExp(`(${iconCjsListMatchers[0]})|(${iconComponentMatchers[0]})`);

export function loadIcon(id: string, iconBox: string, iconBoxLib: any) {
  if (!iconBox || !iconBoxLib) {
    return;
  }

  // cjs -> es
  if (pathMatch(id, iconCjsListMatchers)) {
    return `export * from  '../es/index.js'`;
  }

  let componentName = pathMatch(id, iconComponentMatchers);
  if (componentName) {
    // icon-edit => IconEdit
    componentName = componentName.replace(/((^|-)([a-z]))/g, (_match, _p1, _p2, p3) =>
      p3.toUpperCase()
    );
    if (iconBoxLib[componentName]) {
      return `export { default } from  '${iconBox}/esm/${componentName}/index.js'`;
    }
  }
}

export function modifyIconConfig(config: UserConfig, iconBox: string, iconBoxLib: any) {
  if (!iconBox || !iconBoxLib) {
    return;
  }
  // Pre-Bundling
  config.optimizeDeps = config.optimizeDeps || {};
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
