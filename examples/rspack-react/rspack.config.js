const ArcoRspackPlugin = require('@arco-plugins/rspack-react');

module.exports = {
  mode: 'development',
  entry: './src/main.jsx',
  output: {
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [
    new ArcoRspackPlugin({
      include: ['src', /\/components\//, '../component-a'],
      theme: '@arco-themes/react-plugin-test',
    }),
  ],
};
