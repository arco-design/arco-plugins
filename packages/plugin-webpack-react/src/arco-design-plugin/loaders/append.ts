import { getOptions } from 'loader-utils';
import { LoaderDefinitionFunction } from 'webpack';

export const AppendLoader: LoaderDefinitionFunction = function (source) {
  const options = getOptions(this);
  const additionContent = `${options.additionContent}`;

  if (!additionContent) return source;

  return `
    ${source}\n
    ${additionContent.replace(/__ARCO_PLACEHOLDER__/g, '!')}\n
  `;
};

module.exports = AppendLoader;
module.exports.default = AppendLoader;
