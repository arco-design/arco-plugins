const parser = require('@babel/parser');
const loaderUtils = require('loader-utils');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// 替换默认语言包
module.exports = function ReplaceArcoIcon(resource) {
  const options = loaderUtils.getOptions(this);
  const { type = 'es', defaultLanguage } = options;
  const ast = parser.parse(resource, {
    sourceType: type === 'es' ? 'module' : 'script',
  });

  const replaceLanguage = (source) => {
    return source.replace(/([a-zA-Z-]+)(.js|.ts)?$/, defaultLanguage);
  };

  if (type === 'lib') {
    traverse(ast, {
      CallExpression(path) {
        const { node } = path;
        const { callee } = node;
        if (callee.name === 'require') {
          node.arguments[0].value = replaceLanguage(node.arguments[0].value);
        }
      },
    });
  }

  if (type === 'es') {
    traverse(ast, {
      ImportDeclaration(path) {
        const { node } = path;
        const { source } = node;
        source.value = replaceLanguage(source.value);
      },
    });
  }

  return generate(ast).code;
};
