import * as parser from '@babel/parser';
import * as types from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';

import { libraryName, fullCssMatchers } from './config';
import {
  getComponentConfig,
  importComponent,
  importStyle,
  pathMatch,
  readFileStrSync,
} from './utils';

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
      if (types.isCallExpression(node)) {
        const { callee, arguments: args } = node as any;
        const funcName = callee.name;
        const importedName = args?.[0]?.value;
        // a-input-number => InputNumber
        const componentName =
          typeof importedName === 'string'
            ? importedName
                .replace(new RegExp(`^${componentPrefix}-`), '')
                .replace(/(^|-)[a-z]/g, (w) => w.replace('-', '').toUpperCase())
            : undefined;
        if (
          !componentName ||
          !['_resolveComponent', '_resolveDynamicComponent'].includes(funcName)
        ) {
          return;
        }
        const componentConfig = getComponentConfig(libraryName, componentName);
        if (componentConfig) {
          // 导入组件，此处会触发下面 import 方式的逻辑，所以不需要再导入样式
          importComponent({
            path,
            componentDir: componentConfig.dir,
            componentName,
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
              const componentConfig = getComponentConfig(libraryName, importedName);
              if (componentConfig?.styleDir) {
                dirs.push(componentConfig.styleDir);
              }
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
