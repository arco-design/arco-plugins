# @arco-plugins/vite-vue

## Feature

1. `Style lazy load`
2. `Theme import`
3. `Icon replacement`

> `Style lazy load` doesn't work during development for better experience.

## Install

```bash
npm i @arco-plugins/vite-vue -D
```

## Usage

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
    <Button type="secondary">Cancel</Button>
    <a-button type="primary">Submit</a-button>
    <component is="a-button" loading>Loading</component>
  </div>
</template>
```

## Options

The plugin supports the following parameters:

|        Params         |          Type          | Default Value | Description                                                                         |
| :-------------------: | :--------------------: | :-----------: | :---------------------------------------------------------------------------------- |
|      **`theme`**      |       `{String}`       |      `-`      | Theme package name                                                                  |
|     **`iconBox`**     |       `{String}`       |      `-`      | Icon library package name                                                           |
|   **`modifyVars`**    |       `{Object}`       |      `-`      | Less variables                                                                      |
|      **`style`**      |   `{'css'\|Boolean}`   |    `true`     | Style import method                                                                 |
| **`varsInjectScope`** | `{(string\|RegExp)[]}` |      `-`      | Scope of injection of less variables (modifyVars and the theme package's variables) |
| **`componentPrefix`** |       `{String}`       |     `'a'`     | Component prefix                                                                    |
|   **`iconPrefix`**    |       `{String}`       |      `icon`      | Icon component prefix                                                               |

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
