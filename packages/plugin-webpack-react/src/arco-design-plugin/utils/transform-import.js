const babel = require('@babel/core');
const { merge } = require('lodash');
const babelConfig = require('../config/babel.config');
const { ARCO_DESIGN_COMPONENT_NAME, ARCO_DESIGN_ICON_NAME } = require('../config');

const babelPluginImport = require.resolve('babel-plugin-import');

function getBabelPluginFlag(suffix) {
  return `__arco_babel_plugin__${suffix}`;
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
      iconbox: '',
      babelConfig: {},
    },
    options || {}
  );
}

function getBabelPlugins(options) {
  const _options = getTransformOptions(options);

  return [
    ...(_options.babelConfig.plugins || []),
    ...getArcoImportPlugins({
      libraryDirectory: _options.libraryDirectory,
      style: _options.style,
    }),
    ...getIconBoxImportPlugins(_options.iconbox),
  ];
}

function transformImport(source, options) {
  const _options = getTransformOptions(options);

  const babelPlugins = getBabelPlugins();

  const babelPresets = [...babelConfig.presets, ...(_options.babelConfig.presets || [])];

  const transformResult = babel.transformSync(
    source,
    merge({}, _options.babelConfig, {
      filename: '',
      presets: babelPresets,
      plugins: babelPlugins,
    })
  );

  return transformResult.code;
}

module.exports = {
  getBabelPlugins,
  transformImport,
};
