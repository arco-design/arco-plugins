import { getOptions } from 'loader-utils';
import { LoaderDefinitionFunction } from 'webpack';
import { transformImport } from '../utils/transform-import';

export const TransformImportLoader: LoaderDefinitionFunction = function (source) {
  const options = getOptions(this);
  const code = transformImport(source, {
    ...options,
    babelConfig: {
      ...options.babelConfig,
      filename: this.resourcePath,
      sourceFileName: this.resourcePath,
    }
  });

  return code;
};

module.exports = TransformImportLoader;
module.exports.default = TransformImportLoader;
