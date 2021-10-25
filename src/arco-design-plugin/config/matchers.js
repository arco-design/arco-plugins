const { ARCO_DESIGN_COMPONENT_NAME } = require('.');

module.exports = {
  lessMatchers: `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/**/*.less`,
  globalLessMatchers: `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/style/index.less`,
  globalCssMatchers: `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/style/index.css`,
  esLocalDefaultMatchers: `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/es/locale/default.js`,
  libLocalDefaultMatchers: `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/lib/locale/default.js`,
  componentLessMatchers: (componentName) =>
    `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/${componentName}/style/index.less`,
  componentCssMatchers: (componentName) =>
    `**/node_modules/${ARCO_DESIGN_COMPONENT_NAME}/{es,lib}/${componentName}/style/index.css`,
};
