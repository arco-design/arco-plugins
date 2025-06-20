import fs from 'node:fs';
import type { LoaderDefinition } from '@rspack/core';

export interface AppendLoaderOptions {
  theme: string;
  components: Set<string>;
}

function matchGlobalStyle(resourcePath: string) {
  const match = resourcePath.match(/[\\/](es|lib)[\\/]style[\\/]index.(css|less)$/);
  if (!match) return null;
  return {
    module: match[1],
    type: match[2],
  };
}

function matchComponentStyle(resourcePath: string) {
  const match = resourcePath.match(/[\\/](es|lib)[\\/](\w+)[\\/]style[\\/]index.(css|less)$/);
  if (!match) return null;
  return {
    module: match[1],
    name: match[2],
    type: match[3],
  };
}

function getFileSource(path: string) {
  const absolutePath = require.resolve(path);
  return new Promise<string>((resolve, reject) => {
    fs.readFile(absolutePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export const AppendLoader: LoaderDefinition<AppendLoaderOptions> = function (source) {
  const callback = this.async();
  const options = this.getOptions();
  const { resourcePath } = this;

  const matchGlobal = matchGlobalStyle(resourcePath);
  if (matchGlobal) {
    const themeResource = `${options.theme}/theme.${matchGlobal.type}`;
    if (matchGlobal.type === 'css') {
      getFileSource(themeResource)
        .then((themeContent) => callback(null, `${source}\n${themeContent}`))
        .catch(callback);
    } else {
      callback(null, `${source}\n@import '~${themeResource}';`);
    }
    return;
  }

  const matchComponent = matchComponentStyle(resourcePath);
  if (matchComponent && options.components.has(matchComponent.name)) {
    const themeResource = `${options.theme}/components/${matchComponent.name}/index.${matchComponent.type}`;
    if (matchComponent.type === 'css') {
      getFileSource(themeResource)
        .then((themeContent) => callback(null, `${source}\n${themeContent}`))
        .catch(callback);
    } else {
      callback(
        null,
        [
          source,
          `@import (reference) '~${options.theme}/theme.less';`,
          `@import (reference) '~${options.theme}/tokens.less';`,
          `@import '~${themeResource}';`,
        ].join('\n')
      );
    }
    return;
  }

  callback(null, source);
};

module.exports = AppendLoader;
module.exports.default = AppendLoader;
