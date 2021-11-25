const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const loaderUtils = require('loader-utils');
const { printError } = require('../utils');

// 替换Arco组件库内部的图标
module.exports = function ReplaceArcoIcon(content) {
  // iconBox 是图标库
  const { iconBox } = loaderUtils.getOptions(this);
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

  const ast = parser.parse(content, {
    sourceType: 'module',
  });

  const dirname = path.dirname(this.resourcePath);

  traverse(ast, {
    // 找到依赖关系
    ImportDeclaration(source) {
      const { node } = source;
      // 被引入的文件路径全名
      const importedFilename = path.join(dirname, node.source.value);
      // 拿到路径存入对象中
      if (importedFilename.indexOf('@arco-design/web-react/icon/react-icon/') > -1) {
        const iconName = path.basename(node.source.value);
        if (IconBoxLib[iconName]) {
          // 存在可以替换图标
          node.source.value = `${iconBox}/esm/${iconName}`;
        }
      }
    },
  });

  return generate(ast).code;
};
