# @arco-plugins/vite-react

## 特性

1. Style lazy load
2. Theme import
3. Icon replacement

## 安装

```bash
npm i @arco-plugins/vite-react -D
```

## 用法

```js
// vite.config.js

import vitePluginForArco from '@arco-plugins/vite-react'


export default {
  ...
  plugins: [    
    vitePluginForArco({
      theme: '@arco-design/theme-dcd-pc-b',
      iconBox: '@arco-design/iconbox-react-dcd-icon',
    }),
  ],  
}
```

## 参数

插件支持以下参数:

|参数名|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**`theme`**|`{String}`|`-`|主题包名|
|**`iconBox`**|`{String}`|`-`|图标库包名|
|**`modifyVars`**|`{Object}`|`{}`|Less 变量|
|**`style`**|`{'css'\|Boolean}`|`true`| 样式引入方式|

**样式引入方式 **

`style: true`  将引入 less 文件

```js
import '@arco-design/web-react/Affix/style'
```

`style: 'css'` 将引入 css 文件

```js
import '@arco-design/web-react/Affix/style/css'
```

`style: false` 不引入样式

**提示 **

开发环境下，配置图标库 iconBox 后，对于 Arco 组件中引用的图标不能实现替换（如 Alert 组件引用的 icon 不能替换），但是构建之后是会替换的，所以不用担忧
