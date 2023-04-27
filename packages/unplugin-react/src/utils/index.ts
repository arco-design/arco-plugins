import assert from 'assert';
import { makeRe } from 'minimatch';

export const compileGlob = (expr: string) => {
  const regex = makeRe(expr, { dot: true });
  assert(regex);
  return {
    and: [(resource: string) => regex.test(resource)],
    toString() {
      return `glob(${expr})`;
    },
  };
};
