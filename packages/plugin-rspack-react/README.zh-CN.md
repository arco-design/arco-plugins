# @arco-plugins/unplugin-react

`@arco-plugins/unplugin-react` 是协助处理 arco 使用问题的构建插件。

基于 unplugin 实现了跨 bundler 通用的构建能力支持。

## 特性

插件的功能如下：

1. `样式按需加载`：自动配置 import 转换插件实现样式的按需加载。
2. `移除组件库自带的字体包`：指定 `removeFontFace` 为 `true` 可以去掉组件库自带的字体文件。
3. `图标替换`：指定图标库的包名，插件会读取包内图标对组件库内用到的同名的图标进行替换。
4. `替换默认语言`：组件库的默认导入的语言包是中文，这就决定了打包产物中一定会包含中文，如果不想要中文，就可以利用这个参数来将其替换为你需要的语言。

## 支持情况

| 配置项                 | Webpack | Rspack | Vite |
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

与 Rspack 集成使用时相比于 `@arco-plugins/webpack-react` 存在一些不同，这是由 Rspack 与 webpack 的底层差异决定的。

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

相比 webpack 来说 Rspack 不再使用 Babel 来进行有限范围的代码转译，转而使用 SWC 处理包括第三方依赖在内的所有代码，所以去除了对 `include` `extenstions` `babelConfig` `modifyBabelLoader` 配置的支持。

另外由于放弃了对 webpack@4 的支持并对内部实现做了改进，所以不再需要配置 `context` `webpackImplementation`。

出于可维护性的考虑，`@arco-plugins/unplugin-react` 不再支持 `modifyVars` `varsInjectScope` 配置项，你可以通过手动配置 `less-loader` 的配置来实现相同的功能。

## 安装

通过包管理器安装这个工具：

```shell
# npm
$ npm install -D @arco-plugins/unplugin-react

# yarn
$ yarn add -D @arco-plugins/unplugin-react

# pnpm
$ pnpm add -D @arco-plugins/unplugin-react
```

## 用法

以 Rspack 为例，使用方式是在 `rspack.config.js` 文件中加入以下内容：

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

你也可以在 [example-rspack-react](../../examples/rspack-react/) 中找到一个实际可用的示例项目。

## options

插件支持以下参数：

|参数名|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**`theme`**|`{String}`|`-`|主题包名|
|**`iconBox`**|`{String}`|`-`|图标库包名|
|**`libraryDirectory`**|`{'es'\|'lib'}`|`'es'`|导出格式|
|**`style`**|`{String\|Boolean}`|`true`| 样式引入方式|
|**`removeFontFace`**|`{Boolean}`|`false`| 去掉组件库自带的字体文件 |
|**`defaultLanguage`**|`{string}`|`-`| 替换默认的语言，[语言列表](https://arco.design/react/docs/i18n#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80) |
