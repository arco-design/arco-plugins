import * as parser from '@babel/parser';
import * as types from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import { addSideEffect } from '@babel/helper-module-imports';

import { libraryName, fullCssMatchers } from './config';
import { pathMatch, readFileStrSync } from './utils';

interface Specifier {
  imported: {
    name: string;
  };
}

type TransformedResult = undefined | { code: string; map: any };

type Style = boolean | 'css';

export function transformCssFile({
  id,
  theme,
}: {
  code: string;
  id: string;
  theme: string;
}): TransformedResult {
  if (theme) {
    const matches = pathMatch(id, fullCssMatchers);
    if (matches) {
      const themeCode = readFileStrSync(`${theme}/css/arco.css`);
      if (themeCode !== false) {
        return {
          code: themeCode,
          map: null,
        };
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
  theme?: string;
  style: Style;
  styleOptimization: boolean;
  sourceMaps: boolean;
}): TransformedResult {
  if (style === false || !/\.(js|jsx|ts|tsx)$/.test(id)) {
    return undefined;
  }
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  }) as any;

  traverse(ast, {
    enter(path: NodePath) {
      const { node } = path;
      // import { Button, InputNumber, TimeLine } from '@arco-design/web-react'
      if (types.isImportDeclaration(node)) {
        const { value } = node.source;
        if (value === libraryName) {
          // lazy load (css files don't support lazy load with theme)
          if (styleOptimization && (style !== 'css' || !theme)) {
            node.specifiers.forEach((spec) => {
              if (types.isImportSpecifier(spec)) {
                const importedName = (spec as Specifier).imported.name;
                const stylePath = `${libraryName}/es/${importedName}/style/${
                  style === 'css' ? 'css.js' : 'index.js'
                }`;
                addSideEffect(path, stylePath);
              }
            });
          }
          // import css bundle file
          else if (style === 'css') {
            addSideEffect(path, `${libraryName}/dist/css/arco.css`);
          }
          // import less bundle file
          else {
            addSideEffect(path, `${libraryName}/dist/css/index.less`);
          }
        }
      }
    },
  });

  return generate(ast, { sourceMaps, sourceFileName: id });
}
