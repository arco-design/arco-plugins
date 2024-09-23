import path from 'path';
import fs from 'fs';
import type { RuleSetRules } from '@rspack/core';

function getPackageRootDir(theme: string) {
  return path.dirname(
    require.resolve(`${theme}/package.json`, {
      paths: [process.cwd()],
    })
  );
}

export function getThemeComponents(theme: string): string[] {
  try {
    const themeComponentDirPath = `${getPackageRootDir(theme)}/components`;
    const ret = fs.readdirSync(themeComponentDirPath);
    return ret || [];
  } catch {
    return [];
  }
}

/**
 * @see https://github.com/arco-design/arco-plugins/blob/c25c55a0a9fe195e1a632a1fa0f63a1bd452df3d/packages/plugin-webpack-react/src/arco-design-plugin/plugin-for-theme.ts#L165-L195
 */
function transformSourceToObject(source = '') {
  // 去掉注释
  const str = source
    .replace(/\/\/.*/g, '') // ‘//’ 之后的所有内容（以一行为结束）
    .replace(/\/\*[\s\S]*?\*\//g, ''); // ‘/**/’ 之间的所有内容
  if (!str) return;
  const cssVarsPrefix = undefined; // this.options.modifyVars?.['arco-cssvars-prefix'];
  const obj: Record<string, string> = {};
  str
    .match(/(?=@)([\s\S]+?)(?=;)/g) // 匹配变量定义，结果为 ‘@变量名: 变量值’
    ?.map((item) => item && item.split(':'))
    .filter((item) => item && item.length === 2)
    .forEach((item) => {
      const key = item[0].replace(/^@/, '').trim();
      let value = item[1].trim();
      if (key && value) {
        if (cssVarsPrefix && value.includes('--')) {
          value = value.replace('--', `${cssVarsPrefix}-`);
        }
        obj[key] = value;
      }
    });

  return obj;
}

export function getThemeTokens(theme: string): Record<string, string> {
  try {
    return transformSourceToObject(
      fs.readFileSync(`${getPackageRootDir(theme)}/tokens.less`, 'utf8')
    );
  } catch {
    return {};
  }
}

export function patchLessOptions(rules: RuleSetRules, updater: (originOptions: any) => void) {
  function patchSingleUse(use: any) {
    if (
      typeof use === 'object' &&
      'loader' in use &&
      typeof use.loader === 'string' &&
      use.loader.includes('less-loader')
    ) {
      if (!use.options) use.options = {};
      updater(use.options);
      return true;
    }
    return false;
  }

  rules.forEach((rule) => {
    if (!rule || rule === '...' || patchSingleUse(rule)) return;
    if (!rule.use || patchSingleUse(rule.use)) return;
    if (Array.isArray(rule.use)) rule.use.forEach((ruleUse) => patchSingleUse(ruleUse));
  });
}
