const loaderUtils = require('loader-utils');

function AppendLoader(source) {
  const options = loaderUtils.getOptions(this);
  const additionContent = `${options.additionContent}`;

  if (!additionContent) return source;

  return `
    ${source}\n
    ${additionContent}\n
  `;
}

module.exports = AppendLoader;
