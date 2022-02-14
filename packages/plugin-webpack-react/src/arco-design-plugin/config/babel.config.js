module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-typescript'),
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
    [require.resolve('@babel/preset-react')],
  ],
};
