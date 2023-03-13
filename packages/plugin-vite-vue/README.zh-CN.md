# @arco-plugins/vite-vue

## 特性

1. `样式按需加载`
2. `主题引入`
3. `图标替换`

> 为了开发体验，开发环境下样式为全量引入

## 安装

```bash
npm i @arco-plugins/vite-vue -D
```

## 用法

```js
// vite.config.js

import { vitePluginForArco } from '@arco-plugins/vite-vue'

export default {
  ...
  plugins: [
    vitePluginForArco(Options),
  ],
}
```

```diff
// main.js

import { createApp } from 'vue'
- import ArcoVue from '@arco-design/web-vue';
- import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
- import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App);
- app.use(ArcoVue);
- app.use(ArcoVueIcon);
app.mount('#app');
```

```tsx
// *.vue

<script setup>
import { Button } from '@arco-design/web-vue';
</script>

<template>
  <div>
    <Button type="secondary">取消</Button>
    <a-button type="primary">提交</a-button>
    <component is="a-button" loading>加载中</component>
  </div>
</template>
```

## 参数

插件支持以下参数:

|        参数名         |        类型        | 默认值 | 描述                                             |
| :-------------------: | :----------------: | :----: | :----------------------------------------------- |
|      **`theme`**      |     `{String}`     |  `-`   | 主题包名                                         |
|     **`iconBox`**     |     `{String}`     |  `-`   | 图标库包名                                       |
|   **`modifyVars`**    |     `{Object}`     |  `-`   | Less 变量                                        |
|      **`style`**      | `{'css'\|Boolean}` | `true` | 样式引入方式                                     |
| **`varsInjectScope`** |     `string[]`     |  `-`   | less 变量（modifyVars 和主题包的变量）注入的范围 |
| **`componentPrefix`** |     `{String}`     | `'a'`  | 组件前缀                                         |
|   **`iconPrefix`**    |     `{String}`     |  `icon`   | 图标组件前缀                                     |

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
