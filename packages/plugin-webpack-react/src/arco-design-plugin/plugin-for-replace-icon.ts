import path from 'path';
import { ArcoDesignPluginOptions } from './interface';

export class ReplaceIconPlugin {
  options: ArcoDesignPluginOptions;

  constructor(options: ArcoDesignPluginOptions) {
    this.options = options;
  }

  apply(compiler) {
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
