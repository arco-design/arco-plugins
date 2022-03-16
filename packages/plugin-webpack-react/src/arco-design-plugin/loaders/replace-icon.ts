import { dirname, join, basename } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { getOptions } from 'loader-utils';
import { LoaderDefinitionFunction } from 'webpack';
import { printError } from '../utils';

// 替换Arco组件库内部的图标
const ReplaceIconLoader: LoaderDefinitionFunction = function (content) {
  // iconBox 是图标库
  const { iconBox } = getOptions(this) as unknown as { iconBox: string };
  // 引用iconbox的图标包
  let IconBoxLib;

  try {
    IconBoxLib = require(iconBox); // eslint-disable-line
  } catch (e) {
    printError(`Cannot find module ${iconBox}`);
  }

  if (!IconBoxLib) {
    return content;
  }

  const ast = parse(content, {
    sourceType: 'module',
  });

  const dir = dirname(this.resourcePath);

  traverse(ast, {
    // 找到依赖关系
    ImportDeclaration(source) {
      const { node } = source;
      // 被引入的文件路径全名
      const importedFilename = join(dir, node.source.value);
      // 拿到路径存入对象中
      if (importedFilename.indexOf('@arco-design/web-react/icon/react-icon/') > -1) {
        const iconName = basename(node.source.value);
        if (IconBoxLib[iconName]) {
          // 存在可以替换图标
          node.source.value = `${iconBox}/esm/${iconName}`;
        }
      }
    },
  });

  return generate(ast).code;
};

module.exports = ReplaceIconLoader;
module.exports.default = ReplaceIconLoader;
