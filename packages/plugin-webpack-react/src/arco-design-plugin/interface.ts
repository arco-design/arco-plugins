import webpack from 'webpack';

export interface ArcoDesignPluginOptions {
  context?: string;
  include: string[];
  extensions: string[];
  style: string | boolean;
  libraryDirectory: string;
  iconBox?: string;
  babelConfig?: object;
  removeFontFace?: boolean;
  defaultLanguage?: string;
  theme?: string;
  themeOptions: {
    include: string[];
  };
  modifyVars?: Record<string, string>;
  webpackImplementation?: typeof webpack;
}
