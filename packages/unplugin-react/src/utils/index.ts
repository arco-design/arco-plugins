import assert from 'assert';
import type { RuleSetLogicalConditions } from '@rspack/core';
import { makeRe } from 'minimatch';

export const compileGlob = (expr: string): RuleSetLogicalConditions => {
  const regex = makeRe(expr, { dot: true });
  assert(regex);
  return {
    and: [(resource: string) => regex.test(resource)],
    // toString() {
    //   return `glob(${expr})`;
    // },
  };
};
