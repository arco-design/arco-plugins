import { readFileSync, readdirSync } from 'fs';
import { dirname, extname, resolve, sep, win32, posix, join } from 'path';
import { addNamed, addSideEffect } from '@babel/helper-module-imports';
import traverse, { NodePath } from '@babel/traverse';
import { parse } from '@babel/parser';
import { isExportSpecifier, isIdentifier, isStringLiteral } from '@babel/types';

type Style = boolean | 'css';

// read file content
export function readFileStrSync(path: string): false | string {
  try {
    const resolvedPath = require.resolve(path);
    return readFileSync(resolvedPath).toString();
  } catch (error) {
    return false;
  }
}

// the theme package's component list
const componentsListObj: Record<string, string[]> = {};
export function getThemeComponentList(theme: string) {
  if (!theme) return [];
  if (!componentsListObj[theme]) {
    try {
      const packageRootDir = dirname(require.resolve(`${theme}/package.json`));
      const dirPath = `${packageRootDir}/components`;
      componentsListObj[theme] = readdirSync(dirPath) || [];
    } catch (error) {
      componentsListObj[theme] = [];
    }
  }
  return componentsListObj[theme];
}

export const parse2PosixPath = (path: string) =>
  sep === win32.sep ? path.replaceAll(win32.sep, posix.sep) : path;

// filePath match
export function pathMatch(path: string, conf: [string | RegExp, number?]): false | string {
  const [regStr, order = 0] = conf;
  const reg = new RegExp(regStr);
  const posixPath = parse2PosixPath(path);
  const matches = posixPath.match(reg);
  if (!matches) return false;
  return matches[order];
}

export function parseInclude2RegExp(include: (string | RegExp)[] = [], context?: string) {
  if (include.length === 0) return false;
  context = context || process.cwd();
  const regStrList = [];
  const folders = include
    .map((el) => {
      if (el instanceof RegExp) {
        const regStr = el.toString();
        if (regStr.slice(-1) === '/') {
          regStrList.push(`(${regStr.slice(1, -1)})`);
        }
        return false;
      }
      const absolutePath = parse2PosixPath(resolve(context, el));
      const idx = absolutePath.indexOf('/node_modules/');
      const len = '/node_modules/'.length;
      const isFolder = extname(absolutePath) === '';
      if (idx > -1) {
        const prexPath = absolutePath.slice(0, idx + len);
        const packagePath = absolutePath.slice(idx + len);
        return `(${prexPath}(\\.pnpm/.+/)?${packagePath}${isFolder ? '/' : ''})`;
      }
      return `(${absolutePath}${isFolder ? '/' : ''})`;
    })
    .filter((el) => el !== false);
  if (folders.length) {
    regStrList.push(`(^${folders.join('|')})`);
  }
  if (regStrList.length > 0) {
    return new RegExp(regStrList.join('|'));
  }
  return false;
}

export function isPascalCase(name: string) {
  return /^[A-Z][A-Za-z]*$/.test(name);
}

// kebab-case to PascalCase
export function kebabCaseToPascalCase(name: string) {
  return name.replace(/(^|-)([A-Za-z])/g, (_match, _p1, p2) => p2.toUpperCase());
}

// component config
const componentConfigRecord: {
  [libraryName: string]: {
    [componentName: string]: { dir: string; styleDir?: string } | undefined;
  };
} = {};
export function getComponentConfig(libraryName: string, componentName: string) {
  if (!componentConfigRecord[libraryName]) {
    componentConfigRecord[libraryName] = {};
    try {
      const packageRootDir = dirname(require.resolve(`${libraryName}/package.json`));
      // generate component config
      const indexDeclaration = readFileSync(join(packageRootDir, 'es/index.d.ts'), 'utf8');
      const indexDeclarationAst = parse(indexDeclaration, {
        sourceType: 'module',
        plugins: ['typescript'],
      });
      traverse(indexDeclarationAst, {
        ExportNamedDeclaration: ({ node }) => {
          // when the exported item is a value (non type)
          if (node.exportKind === 'value' && isStringLiteral(node.source)) {
            const componentDir = join(libraryName, 'es', node.source.value).replace(/\\/g, '/');
            node.specifiers.forEach((item) => {
              if (isExportSpecifier(item) && isIdentifier(item.exported)) {
                const _componentName = item.exported.name;
                // check whether it is a component
                const isComponent = isPascalCase(_componentName);
                if (isComponent) {
                  componentConfigRecord[libraryName][_componentName] = {
                    dir: libraryName,
                    styleDir: `${componentDir}/style`,
                  };
                }
              }
            });
          }
        },
      });
      // generate icon component config
      readdirSync(join(packageRootDir, 'es/icon'), { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((file) => file.name)
        .forEach((fileName) => {
          // icon-github => IconGithub
          const _componentName = kebabCaseToPascalCase(fileName);
          componentConfigRecord[libraryName][_componentName] = {
            dir: `${libraryName}/es/icon`,
          };
        });
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
  return componentConfigRecord[libraryName][componentName];
}

export function importComponent({
  path,
  componentDir,
  componentName,
}: {
  path: NodePath;
  componentDir: string;
  componentName: string;
}) {
  const imported = addNamed(path, componentName, componentDir);
  path.replaceWith(imported);
}

export function importStyle({
  componentDirs,
  styleOptimization,
  path,
  style,
  theme,
  libraryName,
}: {
  componentDirs: string[];
  styleOptimization: boolean;
  path: NodePath;
  style: Style;
  theme: string;
  libraryName: string;
}) {
  if (componentDirs.length === 0) return;
  // lazy load (css files don't support lazy load with theme)
  if (styleOptimization && (style !== 'css' || !theme)) {
    componentDirs.forEach((dir) => {
      const stylePath = `${dir}/${style === 'css' ? 'css.js' : 'index.js'}`;
      addSideEffect(path, stylePath);
    });
  }
  // import css bundle file
  else if (style === 'css') {
    addSideEffect(path, `${libraryName}/dist/arco.min.css`);
  }
  // import less bundle file
  else {
    addSideEffect(path, `${libraryName}/dist/arco.less`);
  }
}
