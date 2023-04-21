import type { LoaderDefinitionFunction } from 'webpack';

const fontFaceRegex = /@font-face(.*)?{[^}]*?}/g;

export const RemoveFontFaceLoader: LoaderDefinitionFunction = function (source) {
  return source.replace(fontFaceRegex, '');
};

module.exports = RemoveFontFaceLoader;
module.exports.default = RemoveFontFaceLoader;
