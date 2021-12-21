const { statSync } = require('fs');
const { isAbsolute } = require('path');
const arrify = require('./arrify');

const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;

/**
 * 替换反斜杠
 * @param {string} str
 * @returns {string}
 */
function replaceBackslashes(str) {
  return str.replace(/\\/g, '/');
}

/**
 * 将文件路径转为 absolute
 * @param {string|string[]} files
 * @param {string} context
 * @returns {string[]}
 */
function parseFiles(files, context) {
  return arrify(files).map((file) =>
    isAbsolute(file)
      ? file
      : `${replaceBackslashes(context).replace(
          UNESCAPED_GLOB_SYMBOLS_RE,
          '\\$2'
        )}/${replaceBackslashes(file)}`
  );
}

/**
 * 将文件夹路径结合后缀，转为 glob 格式
 * @param {string|string[]} patterns
 * @param {string|string[]} extensions
 * @returns {string[]}
 */
function parseFoldersToGlobs(patterns, extensions) {
  const extensionsGlob = arrify(extensions).map((extension) => extension.replace(/^\./u, ''));

  return arrify(patterns)
    .map((pattern) => replaceBackslashes(pattern))
    .map((pattern) => {
      try {
        const stats = statSync(pattern);
        if (stats.isDirectory()) {
          const ext =
            extensionsGlob.length === 1 ? extensionsGlob[0] : `{${extensionsGlob.join(',')}}`;
          return pattern.replace(/[/\\]?$/u, `/**/*.${ext}`);
        }
      } catch (error) {
        throw error;
      }
      return pattern;
    });
}

module.exports = {
  parseFiles,
  parseFoldersToGlobs,
};
