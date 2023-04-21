import assert from 'assert';
import { makeRe } from 'minimatch';

export const compileGlob = (expr: string) => {
  const ret = makeRe(expr);
  assert(ret);
  return ret;
};
