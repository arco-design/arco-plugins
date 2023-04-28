# @arco-plugins/unplugin-react

`@arco-plugins/unplugin-react` is a build plugin that helps with arco problems.

It implements cross-bundler build capabilities based on unplugin.

## Features

The features of the plugin are as follows:

1. `On-demand loading of styles`: Automatically configure import conversion plugins to implement on-demand loading of styles.
2. `Removal of font packages included in component libraries`: Specify `removeFontFace` as `true` to remove the font files included in the component library.
3. `Icon replacement`: Specify the package name of the icon library, and the plugin will read the icons in the package and replace them with the same-named icons used in the component library.
4. `Default language replacement`: The default imported language package of the component library is Chinese, which means that the packaging will definitely include Chinese. If you don't want Chinese, you can use this parameter to replace it with the language you need.

## Support

| Configuration item | Webpack | Rspack | Vite |
|:---------------------:|:-------:|:------:|:----:|
| style                 | ⚪      | 🟢     | ⚪   |
| libraryDirectory      | ⚪      | 🟢     | ⚪   |
| iconBox               | ⚪      | 🟢     | ⚪   |
| removeFontFace        | ⚪      | 🟢     | ⚪   |
| defaultLanguage       | ⚪      | 🟢     | ⚪   |
| theme                 | ⚪      | 🟢     | ⚪   |
| context               | ⚪      | ⚪     | ⚪   |
| include               | ⚪      | ⚪     | ⚪   |
| extensions            | ⚪      | ⚪     | ⚪   |
| babelConfig           | ⚪      | ⚪     | ⚪   |
| modifyVars            | ⚪      | ⚪     | ⚪   |
| webpackImplementation | ⚪      | ⚪     | ⚪   |
| varsInjectScope       | ⚪      | ⚪     | ⚪   |
| modifyBabelLoader     | ⚪      | ⚪     | ⚪   |

### Rspack

Compared to `@arco-plugins/webpack-react`, there are some differences when using it in conjunction with Rspack. This is due to the underlying differences between Rspack and webpack.

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

Unlike webpack, Rspack no longer uses Babel for limited-range code conversion, but instead uses SWC to process all code, including third-party dependencies. Therefore, support for `include`, `extensions`, `babelConfig`, and `modifyBabelLoader` configurations has been removed.

In addition, because support for webpack@4 has been abandoned and internal implementation has been improved, `context` and `webpackImplementation` configuration is no longer required.

For maintainability reasons, `@arco-plugins/unplugin-react` no longer supports the `modifyVars` and `varsInjectScope` configuration items. You can achieve the same function by manually configuring the `less-loader`.

## Install

Install this tool via package manager:

```shell
# npm
$ npm install -D @arco-plugins/unplugin-react

# yarn
$ yarn add -D @arco-plugins/unplugin-react

# pnpm
$ pnpm add -D @arco-plugins/unplugin-react
```

## Usage

Take Rspack for example, the usage is to add the following content to the `rspack.config.js` file:

```js
const { ArcoDesignPlugin } = require('@arco-plugins/unplugin-react');

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

You can also find an actual available example project in [example-rspack-react](../../examples/rspack-react/).

## options

The plugin supports the following parameters:

|Parameter |Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`theme`**|`{string}`|`-`|Theme package name|
|**`iconBox`**|`{string}`|`-`|Icon library package name|
|**`libraryDirectory`**|`{'es'\|'lib'}`|`'es'`|Export format|
|**`style`**|`{string\|boolean}`|`true`|Style import method|
|**`removeFontFace`**|`{boolean}`|`false`|Removes the font file included in the component library|
|**`defaultLanguage`**|`{string}`|`-`|Replace default language, [language list](https://arco.design/react/docs/i18n#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80)|
