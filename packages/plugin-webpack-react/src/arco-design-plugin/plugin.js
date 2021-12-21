const PluginForTheme = require('./plugin-for-theme');
const PluginForImport = require('./plugin-for-import');
const PluginForRemoveFontFace = require('./plugin-for-remove-font-face');
// 为 arco 组件库添加loader
const PluginForReplaceIcon = require('./plugin-for-replace-icon');
const PluginForReplaceDefaultLanguage = require('./plugin-for-replace-default-language');

class ArcoWebpackPlugin {
  constructor(options) {
    this.options = options;
    this.pluginForTheme = new PluginForTheme(options);
    this.pluginForImport = new PluginForImport(options);
    this.pluginForRemoveFontFace = new PluginForRemoveFontFace();
    this.pluginForReplaceIcon = new PluginForReplaceIcon(options);
    this.pluginForReplaceDefaultLanguage = new PluginForReplaceDefaultLanguage(options);
  }

  apply(compiler) {
    this.pluginForReplaceIcon.apply(compiler);
    this.pluginForTheme.apply(compiler);
    this.pluginForImport.apply(compiler);
    this.pluginForReplaceDefaultLanguage.apply(compiler);

    if (this.options && this.options.removeFontFace) {
      this.pluginForRemoveFontFace.apply(compiler);
    }
  }
}

module.exports = ArcoWebpackPlugin;
