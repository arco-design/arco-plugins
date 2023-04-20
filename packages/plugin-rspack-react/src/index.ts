import type { Compiler, WebpackPluginInstance } from 'webpack';
import { ArcoDesignPluginOptions } from './types';

export type { ArcoDesignPluginOptions };

export interface ChildPlugin extends WebpackPluginInstance {
  new (options: ArcoDesignPluginOptions);
}

export class ArcoDesignPlugin implements WebpackPluginInstance {
  options: ArcoDesignPluginOptions;
  themePluginInstance: WebpackPluginInstance;
  importPluginInstance: WebpackPluginInstance;
  pluginForImport?: WebpackPluginInstance;
  removeFontFacePluginInstance?: WebpackPluginInstance;
  replaceIconPluginInstance?: WebpackPluginInstance;
  replaceDefaultLanguagePluginInstance?: WebpackPluginInstance;
  constructor(options: Partial<ArcoDesignPluginOptions> = {}) {
    this.options = {
      include: ['src'],
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      style: true,
      libraryDirectory: 'es',
      modifyBabelLoader: true,
      ...options,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  apply(_compiler: Compiler) {
    // this.themePluginInstance = new ThemePlugin(resolveOptions);
    // this.importPluginInstance = new ImportPlugin(resolveOptions);
    // // Compatible with `(new ArcoWebpackPlugin()).pluginForImport.getBabelPlugins()` usage
    // this.pluginForImport = this.importPluginInstance;
    // if (resolveOptions.removeFontFace) {
    //   this.removeFontFacePluginInstance = new RemoveFontFacePlugin();
    // }
    // if (resolveOptions.iconBox) {
    //   this.replaceIconPluginInstance = new ReplaceIconPlugin(resolveOptions);
    // }
    // if (resolveOptions.defaultLanguage) {
    //   this.replaceDefaultLanguagePluginInstance = new ReplaceDefaultLanguagePlugin(resolveOptions);
    // }
  }
}
