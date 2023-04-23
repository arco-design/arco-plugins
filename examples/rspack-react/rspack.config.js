/* eslint-disable import/no-extraneous-dependencies */
const { ArcoDesignPlugin } = require('@arco-plugins/rspack-react');
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
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new ArcoDesignPlugin({
      include: ['src', /\/components\//, '../component-a'],
      theme: '@arco-themes/react-asuka',
    }),
  ],
};
