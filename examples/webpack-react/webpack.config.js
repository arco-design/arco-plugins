const HtmlWebpackPlugin = require('html-webpack-plugin');
const ArcoWebpackPlugin = require('@arco-plugins/webpack-react');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.jsx',
  output: {
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    hot: true,
    port: 8080,
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
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
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: 'body',
    }),
    new ArcoWebpackPlugin({
      webpackImplementation: webpack,
    }),
  ],
};
