import * as parser from '@babel/parser';
import * as types from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';

import { libraryName, fullCssMatchers } from './config';
import { getVueComponentDir, importStyle, pathMatch, readFileStrSync } from './utils';

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
  componentPrefix,
}: {
  code: string;
  id: string;
  theme?: string;
  style: Style;
  styleOptimization: boolean;
  sourceMaps: boolean;
  componentPrefix: string;
}): TransformedResult {
  if (style === false || !/\.(js|jsx|ts|tsx|vue)$/.test(id)) {
    return undefined;
  }
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  }) as any;

  traverse(ast, {
    enter(path: NodePath) {
      const { node } = path;
      // <a-input-number></a-input-number>  <a-timeline-item></a-timeline-item> <component is="a-timeline-item"></component>
      if (
        /**
         * support <script lang="jsx">
         * @path *.vue?vue&type=script&lang.jsx
         * @path *.vue?vue&type=script&setup=true&lang.jsx
         */
        /\.vue(\?vue&type=script(&setup=true)?&lang.[jt]sx)?$/.test(id) &&
        types.isCallExpression(node)
      ) {
        const { callee, arguments: args } = node as any;
        const funcName = callee.name;
        const importedName = args?.[0]?.value;
        if (
          !importedName ||
          !['_resolveComponent', '_resolveDynamicComponent'].includes(funcName)
        ) {
          return;
        }
        const dir = getVueComponentDir(libraryName, importedName, componentPrefix);

        if (dir) {
          importStyle({
            componentDirs: [dir],
            styleOptimization,
            path,
            style,
            theme,
            libraryName,
          });
        }
        return;
      }

      // import { Button, InputNumber, TimeLine } from '@arco-design/web-vue'
      if (types.isImportDeclaration(node)) {
        const { value } = node.source;
        const dirs: string[] = [];
        if (value === libraryName) {
          node.specifiers.forEach((spec) => {
            if (types.isImportSpecifier(spec)) {
              const importedName = (spec as Specifier).imported.name;
              // InputNumber => input-number
              const dir = importedName.replace(
                /([A-Z])/g,
                (_match, p1, index) => `${index > 0 ? '-' : ''}${p1.toLowerCase()}`
              );
              dirs.push(dir);
            }
          });
          importStyle({
            componentDirs: dirs,
            styleOptimization,
            path,
            style,
            theme,
            libraryName,
          });
        }
      }
    },
  });

  return generate(ast, { sourceMaps, sourceFileName: id });
}
