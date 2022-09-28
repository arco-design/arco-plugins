import { getOptions } from 'loader-utils';
import { LoaderDefinitionFunction } from 'webpack';
import { transformImport } from '../utils/transform-import';

export const TransformImportLoader: LoaderDefinitionFunction = function (source) {
  const options = getOptions(this);

  const babelConfig = {
    filename: this.resourcePath,
    sourceFileName: this.resourcePath,
  };
  if (typeof options.babelConfig === 'object') {
    Object.assign(babelConfig, options.babelConfig);
  }

  const code = transformImport(source, {
    ...options,
    babelConfig,
  });

  return code;
};

module.exports = TransformImportLoader;
module.exports.default = TransformImportLoader;
