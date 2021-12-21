const { readFileSync } = require('fs');
const arrify = require('./arrify');
const glob = require('./glob');
const print = require('./print');

function getFileSource(filePath) {
  try {
    const fileAbsolutePath = require.resolve(filePath);
    const source = readFileSync(fileAbsolutePath);
    return source.toString();
  } catch (error) {
    return '';
  }
}

module.exports = {
  arrify,
  glob,
  print,
  getFileSource,
};
