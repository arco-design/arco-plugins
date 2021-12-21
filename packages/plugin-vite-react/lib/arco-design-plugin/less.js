"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyCssConfig = void 0;
const config_1 = require("./config");
const utils_1 = require("./utils");
// eslint-disable-next-line import/prefer-default-export
function modifyCssConfig(config, theme, modifyVars) {
    config.css = config.css || {};
    const { preprocessorOptions = {} } = config.css;
    preprocessorOptions.less = preprocessorOptions.less || {};
    preprocessorOptions.less.javascriptEnabled = true;
    preprocessorOptions.less.modifyVars = preprocessorOptions.less.modifyVars || {};
    if (theme) {
        preprocessorOptions.less.modifyVars.hack = preprocessorOptions.less.modifyVars.hack || '';
        preprocessorOptions.less.modifyVars.hack += `; @import "${theme}/tokens.less";`;
        preprocessorOptions.less.plugins = preprocessorOptions.less.plugins || [];
        preprocessorOptions.less.plugins.push({
            install(_lessObj, pluginManager) {
                pluginManager.addPreProcessor({
                    process(src, extra) {
                        const { fileInfo: { filename }, } = extra;
                        // theme global style
                        const themeGlobalCss = `${theme}/theme.less`;
                        // arco global syle
                        let matches = (0, utils_1.pathMatch)(filename, config_1.globalLessMatchers);
                        if (matches) {
                            src += `; @import '${themeGlobalCss}';`;
                            return src;
                        }
                        // arco full style
                        matches = (0, utils_1.pathMatch)(filename, config_1.fullLessMatchers);
                        if (matches) {
                            const componentsLess = `${theme}/component.less`;
                            const list = [themeGlobalCss];
                            if ((0, utils_1.isModExist)(componentsLess)) {
                                list.push(componentsLess);
                            }
                            list.forEach((it) => {
                                src += `; @import '${it}';`;
                            });
                            return src;
                        }
                        // arco component style
                        const componentName = (0, utils_1.pathMatch)(filename, config_1.componentLessMatchers);
                        if (componentName) {
                            if ((0, utils_1.getThemeComponentList)(theme).includes(componentName)) {
                                src += `; @import '${theme}/components/${componentName}/index.less';`;
                            }
                        }
                        return src;
                    },
                }, 1000);
            },
        });
    }
    Object.assign(preprocessorOptions.less.modifyVars, modifyVars);
    config.css.preprocessorOptions = preprocessorOptions;
}
exports.modifyCssConfig = modifyCssConfig;
