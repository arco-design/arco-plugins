import type { UserConfig } from 'vite';

import { iconComponentMatchers, libraryName } from './config';
import { pathMatch } from './utils';

export function modifyIconConfig(config: UserConfig, iconBoxLib: any) {
  if (!iconBoxLib) return;
  config.optimizeDeps = config.optimizeDeps || {};
  config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
  if (!config.optimizeDeps.exclude.includes(`${libraryName}/icon`)) {
    config.optimizeDeps.exclude.push(`${libraryName}/icon`);
  }
}

export function loadIcon(id: string, iconBox: string, iconBoxLib: any) {
  if (!iconBox || !iconBoxLib) return;
  const componentName = pathMatch(id, iconComponentMatchers);
  if (componentName && iconBoxLib[componentName]) {
    return `export { default } from  '${iconBox}/esm/${componentName}/index.js'`;
  }
}
