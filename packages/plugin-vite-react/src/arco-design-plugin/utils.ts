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
