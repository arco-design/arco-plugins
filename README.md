# @arco-design/webpack-plugin

`@arco-design/webpack-plugin` is a webpack plugin to help deal with arco usage issues. 

## Feature


1. `Style lazy load`：Add babel-plugin-import to babel-loader to enable style lazy loading。*If there is a babel-plugin-import for arco-design/web-react, it will be replaced*。
2. `Theme import`：Specify the theme package name, the plugin will read the variable content of the theme package and inject it into modifyVars of less-loader。
3. `Remove the font package that comes with the component library`：Set `removeFontFace` to `true` to remove the font file that comes with the component library。
4. `Icon replacement`：Specify the package name of the icon library, the plug-in will read the icon in the package and replace the icon with the same name used in the component library.。
5. `Replace default language`：The default imported language pack of the component library is Chinese, which determines that Chinese will be included in the packaged product. If you don't want Chinese, you can use this parameter to replace it with the language you need.
6. `Get lazy load babel plugin configuration`：The implementation of on-demand loading is achieved by injecting babel-plugin-import configuration into babel. These configurations are open for everyone to use and can be obtained through `(new ArcoWebpackPlugin()).pluginForImport().getBabelPlugins()`.

## Install

Use npm/yarn to install the plugin:

```shell
# npm
$ npm install -D @arco-design/webpack-plugin

# yarn
$ yarn add @arco-design/webpack-plugin
```

## Usage

To to the plugin, add the following code in webpack config:

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

The plugin supports the following parameters:

|Params|Type|Default Value|Description|
|:--:|:--:|:-----:|:----------|
|**`include`**|`{String[]}`|`['src']`|File directory used by bebel-plugin-import|
|**`extensions`**|`{String[]}`|`['js', 'jsx', 'ts', 'tsx']`| File suffix used by bebel-plugin-import |
|**`theme`**|`{String}`|`-`|Theme package name|
|**`iconBox`**|`{String}`|`-`|Icon library package name|
|**`modifyVars`**|`{Object}`|`{}`|Less variables|
|**`style`**|`{String\|Boolean}`|`true`| Style import method|
|**`removeFontFace`**|`{Boolean}`|`false`| Whether to remove the font file that comes with the component library |
|**`defaultLanguage`**|`{string}`|`-`| Replace the default language，[language list](https://arco.design/react/docs/i18n#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80)|

**Style import methods **

`style: true` will import less file

```js
import '@arco-design/web-react/Affix/style'
```

`style: 'css'` will import css file

```js
import '@arco-design/web-react/Affix/style/css'
```

`style: false` will not import any style file
