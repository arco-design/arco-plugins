# @arco-plugins/vite-react

## 特性

1. `样式按需加载`
2. `主题引入`
3. `图标替换`

> 为了开发体验，开发环境下样式为全量引入

## 安装

```bash
npm i @arco-plugins/vite-react -D
```

## 用法

```js
// vite.config.js

import { vitePluginForArco } from '@arco-plugins/vite-react'

export default {
  ...
  plugins: [
    vitePluginForArco(options),
  ],
}
```

```tsx
// react
import { Button } from '@arco-design/web-react';

export default () => (
  <div>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Submit</Button>
  </div>
);
```

## 参数

插件支持以下参数:

|      参数名      |        类型        | 默认值 | 描述         |
| :--------------: | :----------------: | :----: | :----------- |
|   **`theme`**    |     `{String}`     |  `''`   | 主题包名     |
|  **`iconBox`**   |     `{String}`     |  `''`   | 图标库包名   |
| **`modifyVars`** |     `{Object}`     |  `{}`  | Less 变量    |
|   **`style`**    | `{'css'\|Boolean}` | `true` | 样式引入方式 |
|**`varsInjectScope`**|`string[]`|`[]`| less 变量（modifyVars 和主题包的变量）注入的范围 |

**样式引入方式 **

`style: true` 将引入 less 文件

```js
import '@arco-design/web-react/Affix/style';
```

`style: 'css'` 将引入 css 文件

```js
import '@arco-design/web-react/Affix/style/css';
```

`style: false` 不引入样式
