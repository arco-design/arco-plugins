"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentCssMatchers = exports.globalCssMatchers = exports.fullCssMatchers = exports.componentLessMatchers = exports.globalLessMatchers = exports.fullLessMatchers = exports.iconComponentMatchers = exports.libraryName = void 0;
exports.libraryName = '@arco-design/web-react';
exports.iconComponentMatchers = [
    `${exports.libraryName}/icon/react-icon/([^/]+)/index\\.js[^/]*$`,
    1,
];
exports.fullLessMatchers = [`${exports.libraryName}/dist/css/index\\.less[^/]*$`];
exports.globalLessMatchers = [`${exports.libraryName}/(es|lib)/style/index\\.less[^/]*$`];
exports.componentLessMatchers = [
    `${exports.libraryName}/(es|lib)/([^/]+)/style/index\\.less[^/]*$`,
    2,
];
exports.fullCssMatchers = [`${exports.libraryName}/dist/css/arco\\.css[^/]*$`];
exports.globalCssMatchers = [`${exports.libraryName}/(es|lib)/style/index\\.css[^/]*$`];
exports.componentCssMatchers = [
    `${exports.libraryName}/(es|lib)/([^/]+)/style/index\\.css[^/]*$`,
    2,
];
