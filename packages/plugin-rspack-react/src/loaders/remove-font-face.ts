import type { LoaderDefinitionFunction } from 'webpack';

const fontFaceRegex = /@font-face(.*)?{[^}]*?}/g;

export const RemoveFontFaceLoader: LoaderDefinitionFunction = function (source) {
  const res = source.replace(fontFaceRegex, '');
  return `${res}`;
};

module.exports = RemoveFontFaceLoader;
module.exports.default = RemoveFontFaceLoader;
