# @arco-plugins/vite-vue

## Feature

1. `Style lazy load`
2. `Theme import`
3. `Icon replacement`

## Install

```bash
npm i @arco-plugins/vite-vue -D
```

## Usage

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

## Options

The plugin supports the following parameters:

|        Params         |        Type        | Default Value | Description               |
| :-------------------: | :----------------: | :-----------: | :------------------------ |
|      **`theme`**      |     `{String}`     |      `-`      | Theme package name        |
|     **`iconBox`**     |     `{String}`     |      `-`      | Icon library package name |
|   **`modifyVars`**    |     `{Object}`     |     `{}`      | Less variables            |
|      **`style`**      | `{'css'\|Boolean}` |    `true`     | Style import method       |
| **`componentPrefix`** |     `{String}`     |      `a`      | componentPrefix           |

**Style import methods **

`style: true` will import less file

```js
import '@arco-design/web-vue/Affix/style';
```

`style: 'css'` will import css file

```js
import '@arco-design/web-vue/Affix/style/css';
```

`style: false` will not import any style file
