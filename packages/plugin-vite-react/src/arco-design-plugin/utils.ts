import { readFileSync, readdirSync } from 'fs';
import { dirname, extname, resolve, sep, win32, posix } from 'path';

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
      require.resolve(path);
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
