import type { webpack, WebpackPluginInstance } from 'webpack';

import { ThemePlugin } from './plugin-for-theme';
import { ImportPlugin } from './plugin-for-import';
import { RemoveFontFacePlugin } from './plugin-for-remove-font-face';
import { ReplaceIconPlugin } from './plugin-for-replace-icon';
import { ReplaceDefaultLanguagePlugin } from './plugin-for-replace-default-language';

interface ArcoDesignPluginOptions {
  include?: string[];
  extensions?: string[];
  theme?: string;
  iconBox?: string;
  modifyVars?: Record<string, string>;
  style?: string | boolean;
  removeFontFace?: boolean;
  defaultLanguage?: string;
  webpackImplementation?: typeof webpack;
}

export class ArcoDesignPlugin {
  options: ArcoDesignPluginOptions;
  themePluginInstance: WebpackPluginInstance;
  importPluginInstance: WebpackPluginInstance;
  removeFontFacePluginInstance: WebpackPluginInstance;
  replaceIconPluginInstance: WebpackPluginInstance;
  replaceDefaultLanguagePluginInstance: WebpackPluginInstance;
  constructor(options: ArcoDesignPluginOptions = {}) {
    global.__arcowebpackplugin__ = { options };
    this.options = options;
    this.themePluginInstance = new ThemePlugin(options);
    this.importPluginInstance = new ImportPlugin(options);
    this.removeFontFacePluginInstance = new RemoveFontFacePlugin();
    this.replaceIconPluginInstance = new ReplaceIconPlugin(options);
    this.replaceDefaultLanguagePluginInstance = new ReplaceDefaultLanguagePlugin(options);
  }

  apply(compiler) {
    this.replaceIconPluginInstance.apply(compiler);
    this.themePluginInstance.apply(compiler);
    this.importPluginInstance.apply(compiler);
    this.replaceDefaultLanguagePluginInstance.apply(compiler);

    if (this.options && this.options.removeFontFace) {
      this.removeFontFacePluginInstance.apply(compiler);
    }
  }
}
