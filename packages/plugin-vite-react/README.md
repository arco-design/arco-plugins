# @byted-motor/vite-plugin-arco-import

## Feature

1. Style lazy load
2. Theme import
3. Icon replacement

## Install

```bash
npm i @byted-motor/vite-plugin-arco-import -D
```

## Usage

```js
// vite.config.js

import vitePluginArcoImport from '@byted-motor/vite-plugin-arco-import'


export default {
  ...
  plugins: [    
    vitePluginArcoImport({
      theme: '@arco-design/theme-dcd-pc-b',
      iconBox: '@arco-design/iconbox-react-dcd-icon',
    }),
  ],  
}
```

```tsx
// react
import { Button } from '@arco-design/web-react'

export default () => (
  <div>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Submit</Button>    
  </div>
)
```

## Options

The plugin supports the following parameters:

|Params|Type|Default Value|Description|
|:--:|:--:|:-----:|:----------|
|**`theme`**|`{String}`|`-`|Theme package name|
|**`iconBox`**|`{String}`|`-`|Icon library package name|
|**`modifyVars`**|`{Object}`|`{}`|Less variables|
|**`style`**|`{'css'\|Boolean}`|`true`| Style import method|

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


** Tips **

 During development,The iconBox may not effect the icons built in Arco components(e.g. the icon of Alert).
