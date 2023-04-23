export interface ArcoDesignPluginOptions {
  /** @deprecated The pluginImport feature of Rspack will affect all files. */
  include?: (string | RegExp)[];
  extensions?: string[];
  style?: string | boolean;
  libraryDirectory?: string;
  iconBox?: string;
  removeFontFace?: boolean;
  defaultLanguage?: string;
  theme?: string;
  /** @deprecated `modifyVars` should be config in options of less-loader manually. */
  modifyVars?: Record<string, string>;
  /** @deprecated `varsInjectScope` should be config in options of less-loader manually. */
  varsInjectScope?: (string | RegExp)[];
}
