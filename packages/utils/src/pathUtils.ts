import { extname, resolve } from 'path';
import { isString, isRegExp } from 'lodash';
import micromatch from 'micromatch';

import { arrify } from './arrify';

const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
const NODE_MODULES_REGEXP = /(\/node_modules\/)/;

/**
 * 替换反斜杠
 * @param {string} str
 * @returns {string}
 */
function replaceBackslashes(str: string) {
  return str.replace(/\\/g, '/');
}

/**
 * 将后缀转为 glob 格式
 * @param {string|string[]} patterns
 * @param {string|string[]} extensions
 * @returns {string[]}
 */
function getExtensionsGlob(extensions: string[]) {
  const extensionsGlob = arrify(extensions).map((extension) => extension.replace(/^\./u, ''));
  const ext = extensionsGlob.length === 1 ? extensionsGlob[0] : `{${extensionsGlob.join(',')}}`;
  return `**/*.${ext}`;
}

/**
 * 将路径转为绝对路径
 * @param {string|string[]} paths
 * @param {string} context
 * @returns {string[]}
 */
function absoluteGlobPatterns(patterns: string | string[], context: string) {
  const validContext = `${replaceBackslashes(context).replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2')}`;
  return arrify(patterns).map((p) => resolve(validContext, replaceBackslashes(p)));
}

/**
 * 转为 glob 格式
 * @param {string|string[]} patterns
 * @returns {string[]}
 */
function parseToGlobPatterns(patterns: string | string[], context: string) {
  return absoluteGlobPatterns(patterns, context).reduce((result, p) => {
    const isFolder = !extname(p);
    const g = isFolder ? p.replace(/[/\\]?$/u, `/**`) : p;
    result.push(g);
    if (NODE_MODULES_REGEXP.test(g)) {
      result.push(g.replace(NODE_MODULES_REGEXP, (_, $1) => `${$1}.pnpm/**${$1}`));
    }
    return result;
  }, [] as string[]);
}

function splitStrAndRegExp(pattern: string | RegExp | (string | RegExp)[]) {
  const patterns = arrify(pattern);
  const strings: string[] = [];
  const regExps: RegExp[] = [];
  patterns.forEach((p) => {
    if (isRegExp(p)) {
      regExps.push(p);
    } else if (p && isString(p)) {
      strings.push(p);
    }
  });
  return {
    strings,
    regExps,
  };
}

interface PathMatchOptions {
  extensions?: string[]; // 后缀
  cwd?: string; // 上下文，如果有传递，将用于生成绝对路径
  extraGlobPattern?: string | string[]; // 额外的 glob 匹配路径
}

/**
 * 生成文件匹配函数
 * @param {string | RegExp | (string | RegExp)[]} pattern
 * @returns (resource: string) => boolean
 */
export function matcher(
  pattern: string | RegExp | (string | RegExp)[],
  options: PathMatchOptions = {}
) {
  const { extensions = [], cwd, extraGlobPattern = [] } = options;
  const { strings, regExps } = splitStrAndRegExp(pattern);
  const patternsForGlob = [
    ...arrify(extraGlobPattern),
    ...(cwd
      ? strings.reduce((res, p) => {
          res.push(...parseToGlobPatterns(p, cwd));
          return res;
        }, [] as string[])
      : strings),
  ];
  // 因为 resource中含有 . 符号时候默认会忽略匹配，所以设置 dot: true
  const globMatchOptions: micromatch.Options = {
    dot: true,
  };
  const isMatchGlob = patternsForGlob.length
    ? (resource: string) => micromatch.isMatch(resource, patternsForGlob, globMatchOptions)
    : () => false;
  const isMatchRegExp = regExps.length
    ? (resource: string) => regExps.some((r) => r.test(resource))
    : () => false;
  const isMatchExt = extensions.length
    ? micromatch.matcher(getExtensionsGlob(extensions), globMatchOptions)
    : () => true;
  return (resource: string) => {
    if (!isMatchExt(resource)) {
      return false;
    }
    return isMatchGlob(resource) || isMatchRegExp(resource);
  };
}

/**
 * 返回是否文件路径匹配
 * @param {string} resource
 * @param {string | RegExp | (string | RegExp)[]} pattern
 * @returns boolean
 */
export function isMatch(
  resource: string,
  pattern: string | RegExp | (string | RegExp)[],
  options: PathMatchOptions = {}
) {
  return matcher(pattern, options)(resource);
}
