# @arco-plugins/rspack-react

`@arco-plugins/rspack-react` is a Rspack plugin that helps to deal with arco usage cases.

## Features

The functionality of the plugin is as follows:

1. `On-demand loading of styles`: Automatically configure `builtins.pluginImport` in `rspack.config.js` to achieve on-demand loading of styles.
2. `Remove font package from component library`: Specifying `removeFontFace` as `true` removes the font files that come with the component library.
3. `Icon replacement`: Specify the package name of the icon library, and the plugin will read the icons with the same name as those used in the component library and replace them.
4. `Replace default language`: The default imported language package of the component library is Chinese, which means that Chinese must be included in the packaged product. If you do not want to include Chinese, you can use this parameter to replace it with the language you need.

## Differences

This plugin has some differences compared to `@arco-plugins/webpack-react`, which is determined by the underlying differences between Rspack and webpack.

```diff
export interface ArcoDesignPluginOptions {
  style?: string | boolean;
  libraryDirectory?: string;
  iconBox?: string;
  removeFontFace?: boolean;
  defaultLanguage?: string;
  theme?: string;
- context?: string;
- include: (string | RegExp)[];
- extensions: string[];
- babelConfig?: object;
- modifyVars?: Record<string, string>;
- webpackImplementation?: typeof webpack;
- varsInjectScope?: (string | RegExp)[];
- modifyBabelLoader?: boolean | 'merge' | 'override';
}
```

Unlike webpack, Rspack no longer uses Babel for limited-range code conversion, but instead uses SWC for all code, including third-party dependencies. Therefore, support for `include`, `extenstions`, `babelConfig`, and `modifyBabelLoader` configurations has been removed.

In addition, because support for webpack@4 has been abandoned and internal improvements have been made, configuring `context` and `webpackImplementation` is no longer necessary.

Finally, for maintainability reasons, `@arco-plugins/rspack-react` no longer supports the `modifyVars` and `varsInjectScope` configuration items, and you can achieve the same functionality by manually configuring the `less-loader` configuration.

## Installation

Install this tool using package managers:

```shell
# npm
$ npm install -D @arco-plugins/rspack-react

# yarn
$ yarn add -D @arco-plugins/rspack-react

# pnpm
$ pnpm add -D @arco-plugins/rspack-react
```

## Usage

The usage method is to add the following content to the `rspack.config.js` file:

```js
const { ArcoDesignPlugin } = require('@arco-plugins/rspack-react');

module.exports = {
  module: {
    rules: [
      {
        type: 'css',
        test: /\.less$/,
        use: [{ loader: 'less-loader' }],
      },
    ],
  },
  plugins: [
    new ArcoDesignPlugin({
      theme: '@arco-themes/react-asuka',
      iconBox: '@arco-iconbox/react-partial-bits',
      removeFontFace: true,
    }),
  ],
};
```

You can also find an actual usable sample project in [example-rspack-react](../../examples/rspack-react/).

## Options

The plugin supports the following parameters:

| Parameter | Type | Default | Description |
|:--:|:--:|:-----:|:----------|
|**`theme`**|`{String}`|`-`|Theme package name|
|**`iconBox`**|`{String}`|`-`|Icon library package name|
|**`libraryDirectory`**|`{'es'\|'lib'}`|`'es'`|Export format|
|**`style`**|`{String\|Boolean}`|`true`| Style import method|
|**`removeFontFace`**|`{Boolean}`|`false`| Remove the font files that come with the component library |
|**`defaultLanguage`**|`{string}`|`-`| Replace the default language, [language list](https://arco.design/react/docs/i18n#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80) |
