"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadIcon = exports.modifyIconConfig = void 0;
const config_1 = require("./config");
const utils_1 = require("./utils");
function modifyIconConfig(config, iconBoxLib) {
    if (!iconBoxLib)
        return;
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
    if (!config.optimizeDeps.exclude.includes(`${config_1.libraryName}/icon`)) {
        config.optimizeDeps.exclude.push(`${config_1.libraryName}/icon`);
    }
}
exports.modifyIconConfig = modifyIconConfig;
function loadIcon(id, iconBox, iconBoxLib) {
    if (!iconBox || !iconBoxLib)
        return;
    const componentName = (0, utils_1.pathMatch)(id, config_1.iconComponentMatchers);
    if (componentName && iconBoxLib[componentName]) {
        return `export { default } from  '${iconBox}/esm/${componentName}/index.js'`;
    }
}
exports.loadIcon = loadIcon;
