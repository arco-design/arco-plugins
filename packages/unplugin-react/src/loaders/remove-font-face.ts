import type { LoaderDefinition } from '../types';

const fontFaceRegex = /@font-face(.*)?{[^}]*?}/g;

export const RemoveFontFaceLoader: LoaderDefinition = function (source) {
  return source.replace(fontFaceRegex, '');
};

module.exports = RemoveFontFaceLoader;
module.exports.default = RemoveFontFaceLoader;
