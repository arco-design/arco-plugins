# @arco-design/webpack-plugin

`@arco-design/webpack-plugin` 是协助处理 arco 使用问题的 webpack 插件。

## 特性

插件的功能如下：

1. `样式按需加载`：为 babel-loader 添加 babel-plugin-import 实现样式的按需加载。*如果原先就有针对 arco-design/web-react 的 babel-plugin-import 将会被替换*。
2. `主题引入`：指定主题包名，插件会读取主题包的变量内容注入到 less-loader 的 modifyVars。
3. `移除组件库自带的字体包`：指定 `removeFontFace` 为 `true` 可以去掉组件库自带的字体文件。
4. `图标替换`：指定图标库的包名，插件会读取包内图标对组件库内用到的同名的图标进行替换。
5. `替换默认语言`：组件库的默认导入的语言包是中文，这就决定了打包产物中一定会包含中文，如果不想要中文，就可以利用这个参数来将其替换为你需要的语言。
6. `获取按需加载的babel插件配置`：按需加载的实现是通过往 babel 注入 babel-plugin-import 配置来实现，这些配置开放出来供大家取用，可通过 `(new ArcoWebpackPlugin()).pluginForImport().getBabelPlugins()` 获取。

## 安装

通过 npm/yarn 安装这个工具：

```shell
# npm
$ npm install -D @arco-design/webpack-plugin

# yarn
$ yarn add @arco-design/webpack-plugin
```

## 用法

使用方式是在 webpack config 文件中加入以下内容：

```js
const ArcoWebpackPlugin = require('@arco-design/webpack-plugin');

// webpack config
{
  plugins: [
    new ArcoWebpackPlugin(options)
  ]
}
```
## options

插件支持以下参数：

|参数名|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**`include`**|`{String[]}`|`['src']`|bebel-plugin-import 作用的文件目录|
|**`extensions`**|`{String[]}`|`['js', 'jsx', 'ts', 'tsx']`| bebel-plugin-import 作用的文件后缀 |
|**`theme`**|`{String}`|`-`|主题包名|
|**`iconBox`**|`{String}`|`-`|图标库包名|
|**`modifyVars`**|`{Object}`|`{}`|less 变量|
|**`style`**|`{String\|Boolean}`|`true`| 样式引入方式|
|**`removeFontFace`**|`{Boolean}`|`false`| 去掉组件库自带的字体文件 |
|**`defaultLanguage`**|`{string}`|`-`| 替换默认的语言，[语言列表](https://arco.design/react/docs/i18n#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80) |

**样式引入方式**

`style: true` 将引入 less 文件

```js
import '@arco-design/web-react/Affix/style'
```

`style: 'css'` 将引入 css 文件

```js
import '@arco-design/web-react/Affix/style/css'
```

`style: false` 不引入样式
