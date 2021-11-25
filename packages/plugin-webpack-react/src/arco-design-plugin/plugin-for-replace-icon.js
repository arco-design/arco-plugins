const path = require('path');

class ArcoPluginForReplaceIcon {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    this.addReplaceIconLoader(compiler);
  }

  // 针对 arco-design 组件库添加图标替换loader
  addReplaceIconLoader(compiler) {
    if (!this.options.iconBox) return;

    compiler.options.module.rules.unshift({
      test: /\.js/,
      include: /node_modules\/@arco-design\/web-react/,
      use: [
        {
          loader: path.resolve(__dirname, './loaders/replace-icon.js'),
          options: {
            iconBox: this.options.iconBox,
          },
        },
      ],
    });
  }
}

module.exports = ArcoPluginForReplaceIcon;
