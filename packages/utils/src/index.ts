import { readFileSync } from 'fs';

export { arrify } from './arrify';
export * as pathUtils from './pathUtils';
export { log as print } from './print';

export function getFileSource(filePath) {
  try {
    const fileAbsolutePath = require.resolve(filePath);
    const source = readFileSync(fileAbsolutePath);
    return source.toString();
  } catch (error) {
    return '';
  }
}
