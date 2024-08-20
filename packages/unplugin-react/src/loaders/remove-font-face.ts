import type { LoaderDefinition } from '@rspack/core';

const fontFaceRegex = /@font-face(.*)?{[^}]*?}/g;

export const RemoveFontFaceLoader: LoaderDefinition = function (source) {
  return source.replace(fontFaceRegex, '');
};

module.exports = RemoveFontFaceLoader;
module.exports.default = RemoveFontFaceLoader;
