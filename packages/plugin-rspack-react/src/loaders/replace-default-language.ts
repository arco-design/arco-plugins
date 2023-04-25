import { Visitor, transformSync, types } from '@babel/core';
import { LoaderDefinition } from '../types';

export interface ReplaceDefaultLanguageLoaderOptions {
  type: 'es' | 'lib';
  defaultLanguage: string;
}

// 替换默认语言包
export const ReplaceDefaultLanguageLoader: LoaderDefinition<ReplaceDefaultLanguageLoaderOptions> =
  function (resource) {
    const { type = 'es', defaultLanguage } = this.getOptions();

    const replaceLanguage = (source: string) => {
      return source.replace(/([a-zA-Z-]+)(.js|.ts)?$/, defaultLanguage);
    };
    const visitor: Visitor = {
      CallExpression(path) {
        const { node } = path;
        const { callee } = node;
        if (!types.isIdentifier(callee)) return;
        if (callee.name !== 'require') return;
        const source = node.arguments[0];
        if (!types.isStringLiteral(source)) return;
        source.value = replaceLanguage(source.value);
      },
      ImportDeclaration(path) {
        const { node } = path;
        const { source } = node;
        source.value = replaceLanguage(source.value);
      },
    };
    const transformed = transformSync(resource, {
      plugins: [{ visitor }],
      sourceType: type === 'es' ? 'module' : 'script',
    });

    this.callback(null, transformed.code, transformed.map);
  };

module.exports = ReplaceDefaultLanguageLoader;
module.exports.default = ReplaceDefaultLanguageLoader;
