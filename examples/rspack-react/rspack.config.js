/* eslint-disable import/no-extraneous-dependencies */
const { ArcoDesignPlugin } = require('@arco-plugins/unplugin-react');
const path = require('path');

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  mode: 'development',
  entry: './src/main.jsx',
  output: {
    publicPath: '/',
  },
  devtool: 'source-map',
  builtins: {
    html: [
      {
        filename: 'index.html',
        template: 'public/index.html',
        inject: 'body',
      },
    ],
  },
  module: {
    rules: [
      {
        type: 'css',
        test: /\.less$/,
        use: [
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@arco-design/web-react': path.resolve(__dirname, 'node_modules/@arco-design/web-react'),
    },
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new ArcoDesignPlugin({
      theme: '@arco-themes/react-asuka',
      iconBox: '@arco-iconbox/react-partial-bits',
      removeFontFace: true,
      defaultLanguage: 'ja-JP',
    }),
  ],
};
