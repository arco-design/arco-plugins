module.exports = {
  presets: [
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
    ['@babel/preset-react'],
  ],
};
