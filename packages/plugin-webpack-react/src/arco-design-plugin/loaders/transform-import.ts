import { getOptions } from 'loader-utils';
import { LoaderDefinitionFunction } from 'webpack';
import { transformImport } from '../utils/transform-import';

export const TransformImportLoader: LoaderDefinitionFunction = function (source) {
  const options = getOptions(this);
  const code = transformImport(source, options);

  return code;
};

module.exports = TransformImportLoader;
module.exports.default = TransformImportLoader;
