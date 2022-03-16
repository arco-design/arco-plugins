import { parse } from '@babel/parser';
import { getOptions } from 'loader-utils';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { LoaderDefinitionFunction } from 'webpack';

interface ReplaceDefaultLanguageLoaderOptions {
  type: 'es' | 'lib';
  defaultLanguage: string;
}

// 替换默认语言包
const ReplaceDefaultLanguageLoader: LoaderDefinitionFunction = function (resource) {
  const options = getOptions(this);
  const { type = 'es', defaultLanguage } =
    options as unknown as ReplaceDefaultLanguageLoaderOptions;
  const ast = parse(resource, {
    sourceType: type === 'es' ? 'module' : 'script',
  });

  const replaceLanguage = (source: string) => {
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

module.exports = ReplaceDefaultLanguageLoader;
module.exports.default = ReplaceDefaultLanguageLoader;
