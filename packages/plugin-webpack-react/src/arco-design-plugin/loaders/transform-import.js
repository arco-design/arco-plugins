const loaderUtils = require('loader-utils');
const { transformImport } = require('../utils/transform-import');

function TransformImportLoader(source) {
  const options = loaderUtils.getOptions(this);
  const code = transformImport(source, options);

  return code;
}

module.exports = TransformImportLoader;
