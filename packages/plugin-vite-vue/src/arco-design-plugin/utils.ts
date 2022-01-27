import { readFileSync, readdirSync } from 'fs';
import { dirname } from 'path';
import { addSideEffect } from '@babel/helper-module-imports';
import { NodePath } from '@babel/traverse';

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

// check if a module existed
const modExistObj: Record<string, boolean> = {};
export function isModExist(path: string) {
  if (modExistObj[path] === undefined) {
    try {
      const resolvedPath = require.resolve(path);
      readFileSync(resolvedPath);
      modExistObj[path] = true;
    } catch (error) {
      modExistObj[path] = false;
    }
  }
  return modExistObj[path];
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

// filePath match
export function pathMatch(path: string, conf: [string, number?]): false | string {
  const [regStr, order = 0] = conf;
  const reg = new RegExp(regStr);
  const matches = path.match(reg);
  if (!matches) return false;
  return matches[order];
}

// component directories
const dirListObj: Record<string, string[]> = {};
function getComponentDirList(libraryName: string) {
  if (!libraryName) return [];
  if (!dirListObj[libraryName]) {
    try {
      const packageRootDir = dirname(require.resolve(`${libraryName}/package.json`));
      const dirPath = `${packageRootDir}/es`;
      dirListObj[libraryName] = readdirSync(dirPath) || [];
    } catch (error) {
      dirListObj[libraryName] = [];
    }
  }
  return dirListObj[libraryName];
}

export function getVueComponentDir(libraryName: string, name: string, prefix: string) {
  const _name = name.toLowerCase();
  const _prefix = `${prefix.toLowerCase()}-`;
  if (name.indexOf(_prefix) !== 0) {
    return '';
  }
  const arr = _name.substring(_prefix.length).split('-');
  const list = getComponentDirList(libraryName);
  let dir = '';
  let temp = '';
  while (arr.length) {
    temp = arr.join('-');
    if (list.includes(temp)) {
      dir = temp;
      break;
    }
    arr.pop();
  }
  return dir;
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
  // lazy load (css files don't support lazy load with theme)
  if (styleOptimization && (style !== 'css' || !theme)) {
    componentDirs.forEach((dir) => {
      const stylePath = `${libraryName}/es/${dir}/style/${style === 'css' ? 'css.js' : 'index.js'}`;
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
