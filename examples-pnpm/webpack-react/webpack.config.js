const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ArcoWebpackPlugin = require('../../packages/plugin-webpack-react/lib');

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
      include: ['src', 'node_modules/arco-pro-radio'],
      webpackImplementation: webpack,
      theme: '@arco-themes/react-plugin-test',
    }),
  ],
};
