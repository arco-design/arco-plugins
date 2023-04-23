import assert from 'assert';
import { makeRe } from 'minimatch';

export const compileGlob = (expr: string) => {
  const regex = makeRe(expr);
  assert(regex);
  return (resource: string) => regex.test(resource);
};
