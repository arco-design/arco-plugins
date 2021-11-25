import { readFileSync, readdirSync } from 'fs';
import { dirname } from 'path';

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
      const themeComponentDirPath = `${packageRootDir}/components`;
      componentsListObj[theme] = readdirSync(themeComponentDirPath) || [];
    } catch (error) {
      componentsListObj[theme] = [];
    }
  }
  return componentsListObj[theme];
}
