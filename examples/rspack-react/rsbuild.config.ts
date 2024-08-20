/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import { ArcoDesignPlugin } from '@arco-plugins/unplugin-react';

export default defineConfig({
  plugins: [
    pluginLess(), //
    pluginReact(),
  ],
  source: {
    entry: {
      index: './src/main.jsx',
    },
  },
  tools: {
    cssExtract: {
      pluginOptions: {
        filename: 'main.css',
      },
    },
    rspack(_config, { appendPlugins }) {
      appendPlugins(
        new ArcoDesignPlugin({
          theme: '@arco-themes/react-asuka',
          iconBox: '@arco-iconbox/react-partial-bits',
          removeFontFace: true,
          defaultLanguage: 'ja-JP',
        })
      );
    },
  },
});
