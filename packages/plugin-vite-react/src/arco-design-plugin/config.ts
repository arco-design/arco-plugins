type Matchers = [string, number?];

export const libraryName = '@arco-design/web-react';

export const iconCjsListMatchers: Matchers = [`${libraryName}/icon/index\\.js[^/]*$`];

export const iconComponentMatchers: Matchers = [
  `${libraryName}/icon/react-icon/([^/]+)/index\\.js[^/]*$`,
  1,
];

export const lessMatchers: Matchers = [`${libraryName}/.+\\.less[^/]*$`];

export const fullLessMatchers: Matchers = [`${libraryName}/dist/css/index\\.less[^/]*$`];

export const globalLessMatchers: Matchers = [`${libraryName}/(es|lib)/style/index\\.less[^/]*$`];

export const componentLessMatchers: Matchers = [
  `${libraryName}/(es|lib)/([^/]+)/style/index\\.less[^/]*$`,
  2,
];

export const fullCssMatchers: Matchers = [`${libraryName}/dist/css/arco\\.css[^/]*$`];

export const globalCssMatchers: Matchers = [`${libraryName}/(es|lib)/style/index\\.css[^/]*$`];

export const componentCssMatchers: Matchers = [
  `${libraryName}/(es|lib)/([^/]+)/style/index\\.css[^/]*$`,
  2,
];
