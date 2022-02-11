type Matchers = [string, number?];

export const libraryName = '@arco-design/web-vue';

export const iconCjsListMatchers: Matchers = [`${libraryName}/lib/icon/index\\.js[^/]*$`];

export const iconComponentMatchers: Matchers = [
  `${libraryName}/(es|lib)/icon/([^/]+)/index\\.js[^/]*$`,
  2,
];

export const fullLessMatchers: Matchers = [`${libraryName}/dist/arco\\.less[^/]*$`];

export const globalLessMatchers: Matchers = [`${libraryName}/(es|lib)/style/index\\.less[^/]*$`];

export const componentLessMatchers: Matchers = [
  `${libraryName}/(es|lib)/([^/]+)/style/index\\.less[^/]*$`,
  2,
];

export const fullCssMatchers: Matchers = [`${libraryName}/dist/arco\\.(min\\.)?css[^/]*$`];

export const globalCssMatchers: Matchers = [`${libraryName}/(es|lib)/style/index\\.css[^/]*$`];

export const componentCssMatchers: Matchers = [
  `${libraryName}/(es|lib)/([^/]+)/style/index\\.css[^/]*$`,
  2,
];
