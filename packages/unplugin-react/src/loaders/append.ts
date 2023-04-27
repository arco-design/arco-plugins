import { LoaderDefinition } from '../types';

export interface AppendLoaderOptions {
  additionContent: string;
}

export const AppendLoader: LoaderDefinition<AppendLoaderOptions> = function (source) {
  const options = this.getOptions();
  const additionContent = `${options.additionContent}`;

  if (!additionContent) return source;

  return [source, additionContent.replace(/__ARCO_PLACEHOLDER__/g, '!')].join('\n');
};

module.exports = AppendLoader;
module.exports.default = AppendLoader;
