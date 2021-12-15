"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const less_1 = require("./less");
const icon_1 = require("./icon");
const transform_1 = require("./transform");
const config_1 = require("./config");
const pkg = require('../../package.json');
function vitePluginArcoImport(options = {}) {
    const { theme = '', iconBox = '', modifyVars = {}, style = true } = options;
    let styleOptimization;
    let iconBoxLib;
    let resolvedConfig;
    let isDevelopment = false;
    if (iconBox) {
        try {
            iconBoxLib = require(iconBox); // eslint-disable-line
        }
        catch (e) {
            console.error(`IconBox ${iconBox} not existed`);
        }
    }
    return {
        name: pkg.name,
        config(config, { command }) {
            isDevelopment = command === 'serve';
            // Lay load
            styleOptimization = command === 'build';
            // css preprocessorOptions
            (0, less_1.modifyCssConfig)(config, theme, modifyVars);
            // iconbox
            (0, icon_1.modifyIconConfig)(config, iconBoxLib);
            const plugin = {
                name: 'test',
                setup(build) {
                    console.log('originjs:commonjs');
                    build.onLoad({
                        filter: new RegExp(`${config_1.libraryName}/lib/index.js`),
                        namespace: 'file',
                    }, async ({ path }) => {
                        console.log('path', path);
                        // const code = fs.readFileSync(id).toString();
                        // let result = lib_1.transformRequire(code, id);
                        // if (result.replaced) {
                        //   console.log('id', id);
                        //   return {
                        //     contents: result.code,
                        //     loader: 'js',
                        //   };
                        // }
                        return null;
                    });
                },
            };
            config.optimizeDeps.esbuildOptions.plugins.push(plugin);
        },
        async load(id) {
            const res = (0, icon_1.loadIcon)(id, iconBox, iconBoxLib);
            if (res !== undefined) {
                return res;
            }
            // other ids should be handled as usually
            return null;
        },
        configResolved(config) {
            resolvedConfig = config;
            // console.log('viteConfig', resolvedConfig)
        },
        transform(code, id) {
            // transform css files
            const res = (0, transform_1.transformCssFile)({
                code,
                id,
                theme,
            });
            if (res !== undefined) {
                return res;
            }
            // css lazy load
            return (0, transform_1.transformJsFiles)({
                code,
                id,
                theme,
                style,
                styleOptimization,
                sourceMaps: isDevelopment || Boolean(resolvedConfig?.build?.sourcemap),
            });
        },
    };
}
exports.default = vitePluginArcoImport;
