# @arco-plugins/vite-react

## 特性

1. `样式按需加载`
2. `主题引入`
3. `图标替换`

## 安装

```bash
npm i @arco-plugins/vite-vue -D
```

## 用法

```js
// vite.config.js

import vitePluginForArco from '@arco-plugins/vite-vue'


export default {
  ...
  plugins: [
    vitePluginForArco(Options),
  ],
}
```

```tsx
// vue
<script setup>
import { Button } from '@arco-design/web-vue';
</script>

<template>
  <div>
    <Button type="secondary">Cancel</Button>
    <a-button type="primary">Submit</a-button>
    <component is="a-button" loading>Loading</component>
  </div>
</template>
```

## 参数

插件支持以下参数:

|        参数名         |        类型        | 默认值 | 描述         |
| :-------------------: | :----------------: | :----: | :----------- |
|      **`theme`**      |     `{String}`     |  `-`   | 主题包名     |
|     **`iconBox`**     |     `{String}`     |  `-`   | 图标库包名   |
|   **`modifyVars`**    |     `{Object}`     |  `{}`  | Less 变量    |
|      **`style`**      | `{'css'\|Boolean}` | `true` | 样式引入方式 |
| **`componentPrefix`** |     `{String}`     |  `a`   | 组件前缀     |

**样式引入方式 **

`style: true` 将引入 less 文件

```js
import '@arco-design/web-vue/Affix/style';
```

`style: 'css'` 将引入 css 文件

```js
import '@arco-design/web-vue/Affix/style/css';
```

`style: false` 不引入样式
