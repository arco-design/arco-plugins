/* eslint-disable import/no-extraneous-dependencies */
const { ArcoDesignPlugin } = require('@arco-plugins/unplugin-react');
const path = require('path');
const rspack = require('@rspack/core');

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  mode: 'development',
  entry: './src/main.jsx',
  output: {
    publicPath: '/',
  },
  devtool: 'source-map',
  experiments: {
    css: true,
  },
  module: {
    rules: [
      // https://rspack.dev/blog/announcing-0-5#remove-default-transformation
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /[\\/]node_modules[\\/]/,
        loader: 'builtin:swc-loader',
        /** @type {rspack.SwcLoaderOptions} */
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      },
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
      '@arco-design/web-react': path.resolve(
        __dirname,
        '../../node_modules/@arco-design/web-react'
      ),
      '@arco-themes/react-asuka': path.resolve(__dirname, 'node_modules/@arco-themes/react-asuka'),
    },
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    // https://rspack.dev/blog/announcing-0-4#migrating-builtin-options-to-builtin-plugins
    new rspack.HtmlRspackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: 'body',
    }),
    new ArcoDesignPlugin({
      theme: '@arco-themes/react-asuka',
      iconBox: '@arco-iconbox/react-partial-bits',
      removeFontFace: true,
      defaultLanguage: 'ja-JP',
    }),
  ],
};
