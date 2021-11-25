import * as parser from '@babel/parser';
import * as types from '@babel/types';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { addSideEffect } from '@babel/helper-module-imports';

import { reactLibraryName, vueLibraryName } from './const';
import { getThemeComponentList, readFileStrSync } from './utils';

interface Specifier {
  imported: {
    name: string;
  };
}

type TransformedResult = undefined | { code: string; map: any };

type Style = boolean | 'css';

export function transformCssFile({
  code,
  id,
  theme,
}: {
  code: string;
  id: string;
  theme: string;
}): TransformedResult {
  if (theme) {
    // full css
    let reg = new RegExp(
      `(${reactLibraryName}|${vueLibraryName})/(dist/css/arco|dist/arco|es/style/index)(\\.min)?\\.css[^/]*$`
    );
    let matches = id.match(reg);
    if (matches) {
      const themeCode = readFileStrSync(`${theme}/css/arco.css`);
      if (themeCode !== false) {
        return {
          code: `${code} ${themeCode}`,
          map: null,
        };
      }
    }

    // component css
    reg = new RegExp(`(${reactLibraryName}|${vueLibraryName})/es/([^/]+)/style/index\\.css[^/]*$`);
    matches = id.match(reg);
    if (matches) {
      if (getThemeComponentList(theme).includes(matches[1])) {
        const themeCode = readFileStrSync(`${theme}/components/${matches[1]}/index.css`);
        if (themeCode !== false) {
          return {
            code: `${code} ${themeCode}`,
            map: null,
          };
        }
      }
    }
  }
  return undefined;
}

export function transformJsFiles({
  code,
  id,
  theme,
  style,
  styleOptimization,
  sourceMaps,
}: {
  code: string;
  id: string;
  theme: string;
  style: Style;
  styleOptimization: boolean;
  sourceMaps: boolean;
}): TransformedResult {
  if (style === false || !/\.(js|jsx|vue|ts|tsx)$/.test(id)) {
    return undefined;
  }
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  }) as any;

  traverse(ast, {
    enter(path) {
      const { node } = path;
      if (types.isImportDeclaration(node)) {
        const { value } = node.source;
        if (value === reactLibraryName || value === vueLibraryName) {
          if (styleOptimization) {
            node.specifiers.forEach((spec) => {
              if (types.isImportSpecifier(spec)) {
                const importedName = (spec as Specifier).imported.name;
                const stylePath = `${value}/es/${importedName}/style/${
                  style === 'css' ? 'css.js' : 'index.js'
                }`;
                addSideEffect(path, stylePath);
              }
            });
          }
          // import css bundle file
          else if (style === 'css') {
            addSideEffect(
              path,
              value === reactLibraryName
                ? `${value}/dist/css/arco.css`
                : `${value}/dist/arco.min.css`
            );
          }
          // import less bundle file
          else {
            const reactLibraryStylePath =
              value === reactLibraryName
                ? `${value}/dist/css/index.less`
                : `${value}/dist/arco.less`;

            addSideEffect(path, theme ? `${theme}/index.less` : reactLibraryStylePath);
          }
        }
      }
    },
  });
  return generate(ast, { sourceMaps, sourceFileName: id });
}
