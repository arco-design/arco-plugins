import { transformSync } from '@babel/core';
import { merge } from 'lodash';
import babelConfig from '../config/babel.config';

const { ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } = require('../config');

const babelPluginImport = require.resolve('babel-plugin-import');
const babelPluginFlagPrefix = '__arco_babel_plugin__';

function getBabelPluginFlag(suffix) {
  return `${babelPluginFlagPrefix}${suffix}`;
}

// babel plugins for component library
function getArcoImportPlugins(options) {
  return [
    [
      babelPluginImport,
      {
        libraryDirectory: 'es',
        style: true,
        ...options,
        libraryName: ARCO_DESIGN_COMPONENT_NAME,
        camel2DashComponentName: false,
      },
      getBabelPluginFlag(`import_${ARCO_DESIGN_COMPONENT_NAME}`),
    ],
    [
      babelPluginImport,
      {
        libraryName: ARCO_DESIGN_ICON_NAME,
        libraryDirectory: 'react-icon',
        camel2DashComponentName: false,
      },
      getBabelPluginFlag(`import_${ARCO_DESIGN_ICON_NAME}`),
    ],
  ];
}

// babel plugins for iconbox
function getIconBoxImportPlugins(iconBoxLibName) {
  if (!iconBoxLibName) return [];
  return [
    [
      babelPluginImport,
      {
        libraryName: iconBoxLibName,
        libraryDirectory: 'esm', // 图标库默认文件夹
        camel2DashComponentName: false,
      },
      getBabelPluginFlag(`import_${iconBoxLibName}`),
    ],
  ];
}

function getTransformOptions(options) {
  return merge(
    {
      libraryDirectory: 'es',
      style: true,
      iconBox: '',
      babelConfig: {},
    },
    options || {}
  );
}

export function getBabelPlugins(options) {
  const _options = getTransformOptions(options);

  return [
    ...(_options.babelConfig.plugins || []),
    ...getArcoImportPlugins({
      libraryDirectory: _options.libraryDirectory,
      style: _options.style,
    }),
    ...getIconBoxImportPlugins(_options.iconBox),
  ];
}

function mergeBabelPresets(defaults, userPresets) {
  const finalPresets = [...defaults];

  userPresets.forEach((p) => {
    const [presetName, presetOptions] = Array.isArray(p) ? p : [p];

    const existedPresetIndex = finalPresets.findIndex((i) => {
      const _presetName = Array.isArray(i) ? i[0] : i;
      // Preset name can be passed in a file path or the name of an npm package,
      // so we use resolved paths to determine whether two presets are the same.
      if (require.resolve(presetName) === require.resolve(_presetName)) {
        return true;
      }
      return false;
    });

    if (existedPresetIndex === -1) {
      finalPresets.push(p);
    } else {
      let mergedPreset = finalPresets[existedPresetIndex];
      mergedPreset = Array.isArray(mergedPreset) ? mergedPreset : [mergedPreset];
      // merge preset options
      mergedPreset[1] = { ...mergedPreset[1], ...presetOptions };
      finalPresets.splice(existedPresetIndex, 1, mergedPreset);
    }
  });

  return finalPresets;
}

export function transformImport(source, options) {
  const _options = getTransformOptions(options);

  const babelPlugins = getBabelPlugins(options);

  const babelPresets = mergeBabelPresets(babelConfig.presets, _options.babelConfig.presets || []);

  const transformResult = transformSync(
    source,
    merge({}, _options.babelConfig, {
      presets: babelPresets,
      plugins: babelPlugins,
    })
  );

  return transformResult.code;
}

export function modifyBabelLoader(loader, options) {
  const { options: loaderOptions } = loader;
  if (loaderOptions?.plugins?.some((item) => item[2]?.startsWith(babelPluginFlagPrefix))) {
    return;
  }
  const { babelConfig: config } = options;
  const plugins = getBabelPlugins(options);
  loader.options = {
    ...loaderOptions,
    ...config,
    presets: [...(loaderOptions.presets || []), ...(config?.presets || [])],
    plugins,
  };
}
