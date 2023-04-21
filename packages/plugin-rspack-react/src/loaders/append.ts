import type { LoaderDefinitionFunction } from 'webpack';

export interface AppendLoaderOptions {
  additionContent: string;
}

export const AppendLoader: LoaderDefinitionFunction<AppendLoaderOptions> = function (source) {
  const options = this.getOptions();
  const additionContent = `${options.additionContent}`;

  if (!additionContent) return source;

  return [source, additionContent.replace(/__ARCO_PLACEHOLDER__/g, '!')].join('\n');
};

module.exports = AppendLoader;
module.exports.default = AppendLoader;
