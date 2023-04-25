import type { Compiler } from '@rspack/core';
import { ImportPlugin } from './plugins/import';
import { RemoveFontFacePlugin } from './plugins/remove-font-face';
import { ReplaceDefaultLanguagePlugin } from './plugins/replace-default-language';
import { ReplaceIconPlugin } from './plugins/replace-icon';
import { ThemePlugin } from './plugins/theme';
import { ArcoDesignPluginOptions } from './types';

export type { ArcoDesignPluginOptions };

export class ArcoDesignPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: Partial<ArcoDesignPluginOptions> = {}) {
    this.options = {
      style: true,
      libraryDirectory: 'es',
      removeFontFace: false,
      ...options,
    };
  }

  async apply(compiler: Compiler) {
    new ThemePlugin(this.options).apply(compiler);
    new ImportPlugin(this.options).apply(compiler);
    if (this.options.removeFontFace) {
      new RemoveFontFacePlugin().apply(compiler);
    }
    if (this.options.iconBox) {
      new ReplaceIconPlugin(this.options).apply(compiler);
    }
    if (this.options.defaultLanguage) {
      new ReplaceDefaultLanguagePlugin(this.options).apply(compiler);
    }
  }
}
