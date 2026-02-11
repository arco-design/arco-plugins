import assert from 'assert';
import { makeRe } from 'minimatch';

export const compileGlob = (expr: string): RegExp => {
  const regex = makeRe(expr, { dot: true });
  assert(regex);
  return regex;
};
