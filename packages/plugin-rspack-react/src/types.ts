export interface ArcoDesignPluginOptions {
  include: (string | RegExp)[];
  extensions: string[];
  style: string | boolean;
  libraryDirectory: string;
  iconBox?: string;
  removeFontFace: boolean;
  defaultLanguage?: string;
  theme?: string;
  modifyVars: Record<string, string>;
  varsInjectScope: (string | RegExp)[];
}
