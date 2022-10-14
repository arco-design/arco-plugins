import * as parser from '@babel/parser';
import * as types from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';

import { libraryName, fullCssMatchers } from './config';
import {
  getComponentConfig,
  importComponent,
  importStyle,
  kebabCaseToPascalCase,
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
  iconPrefix,
}: {
  code: string;
  id: string;
  theme?: string;
  style: Style;
  styleOptimization: boolean;
  sourceMaps: boolean;
  componentPrefix: string;
  iconPrefix: string;
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
        // AInputNumber => InputNumber
        let componentName: string;
        if (typeof importedName === 'string') {
          // to PascalCase
          componentName = kebabCaseToPascalCase(importedName);
          const componentRegExp = new RegExp(`^${kebabCaseToPascalCase(componentPrefix)}[A-Z]`);
          const iconComponentRegExp = new RegExp(`^${kebabCaseToPascalCase(iconPrefix)}[A-Z]`);
          // restore component name
          if (componentRegExp.test(componentName)) {
            componentName = componentName.replace(componentRegExp, (match) => match.slice(-1));
          }
          // restore icon component name
          else if (iconComponentRegExp.test(componentName)) {
            componentName = componentName.replace(iconComponentRegExp, (match) => match.slice(-1));
          }
        }
        if (
          !componentName ||
          !['_resolveComponent', '_resolveDynamicComponent'].includes(funcName)
        ) {
          return;
        }
        const componentConfig = getComponentConfig(libraryName, componentName);
        if (componentConfig) {
          // the following import logic will be triggered here, so there is no need to import style
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
