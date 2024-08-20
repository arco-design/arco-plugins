/* eslint-disable import/no-extraneous-dependencies */
import appTools, { defineConfig } from '@modern-js/app-tools';
import { ArcoDesignPlugin } from '@arco-plugins/unplugin-react';

export default defineConfig({
  plugins: [appTools({ bundler: 'experimental-rspack' })],
  source: {
    entries: {
      main: './src/main.jsx',
    },
  },
  tools: {
    bundlerChain(chain) {
      chain.plugin('ArcoDesignPlugin').use(ArcoDesignPlugin, [
        {
          theme: '@arco-themes/react-asuka',
          iconBox: '@arco-iconbox/react-partial-bits',
          removeFontFace: true,
          defaultLanguage: 'ja-JP',
        },
      ]);
    },
  },
});
