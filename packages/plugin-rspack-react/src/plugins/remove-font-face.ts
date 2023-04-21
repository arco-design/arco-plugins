import type { Compiler, RuleSetUseItem } from '@rspack/core';
import { ARCO_DESIGN_COMPONENT_NAME } from '../config';
import { compileGlob } from '../utils';

export class RemoveFontFacePlugin {
  apply(compiler: Compiler) {
    const use: RuleSetUseItem = {
      loader: require.resolve('../loaders/remove-font-face'),
      options: {},
    };
    compiler.options.module.rules.push({
      test: compileGlob(`**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/style/index.less`),
      type: null,
      use: [use],
    });
  }
}
