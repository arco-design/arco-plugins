const fontFaceRegex = /@font-face(.*)?{[^}]*?}/g;

function RemoveFontFaceLoader(source) {
  const res = source.replace(fontFaceRegex, '');
  return `${res}`;
}

module.exports = RemoveFontFaceLoader;
