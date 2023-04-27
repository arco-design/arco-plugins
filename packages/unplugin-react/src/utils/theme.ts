import path from 'path';
import fs from 'fs';

/**
 * 将文件内容转为对象
 * @param {less file content}} source
 */
export function transformSourceToObject(source = '') {
  // 去掉注释
  const str =
    typeof source === 'string' &&
    source
      .replace(/\/\/.*/g, '') // ‘//’ 之后的所有内容（以一行为结束）
      .replace(/\/\*[\s\S]*?\*\//g, ''); // ‘/**/’ 之间的所有内容
  if (!str.length) return;

  const ret: Record<string, string> = {};
  str
    .match(/(?=@)([\s\S]+?)(?=;)/g) // 匹配变量定义，结果为 ‘@变量名: 变量值’
    .map((item) => item && item.split(':'))
    .filter((item) => item && item.length === 2)
    .forEach((item) => {
      const key = item[0].replace(/^@/, '').trim();
      const value = item[1].trim();
      if (key && value) {
        ret[key] = value;
      }
    });

  return ret;
}

export function getThemeVars(theme: string) {
  try {
    const variableLessPath = require.resolve(`${theme}/tokens.less`);
    const source = fs.readFileSync(variableLessPath);
    return transformSourceToObject(source.toString());
  } catch (error) {
    return {};
  }
}

export function getThemeComponents(theme: string): string[] {
  try {
    const packageRootDir = path.dirname(require.resolve(`${theme}/package.json`));
    const themeComponentDirPath = `${packageRootDir}/components`;
    const ret = fs.readdirSync(themeComponentDirPath);
    return ret || [];
  } catch {
    return [];
  }
}
