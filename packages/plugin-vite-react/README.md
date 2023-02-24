# @arco-plugins/vite-react

## Feature

1. `Style lazy load`
2. `Theme import`
3. `Icon replacement`

> `Style lazy load` doesn't work during development for better experience.

## Install

```bash
npm i @arco-plugins/vite-react -D
```

## Usage

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

## Options

The plugin supports the following parameters:

|      Params      |        Type        | Default Value | Description               |
| :--------------: | :----------------: | :-----------: | :------------------------ |
|   **`theme`**    |     `{String}`     |      `''`      | Theme package name        |
|  **`iconBox`**   |     `{String}`     |      `''`      | Icon library package name |
| **`modifyVars`** |     `{Object}`     |     `{}`      | Less variables            |
|   **`style`**    | `{'css'\|Boolean}` |    `true`     | Style import method       |
|**`varsInjectScope`**|`{(string\|RegExp)[]}`|`[]`| Scope of injection of less variables (modifyVars and the theme package's variables) |

**Style import methods **

`style: true` will import less file

```js
import '@arco-design/web-react/Affix/style';
```

`style: 'css'` will import css file

```js
import '@arco-design/web-react/Affix/style/css';
```

`style: false` will not import any style file
