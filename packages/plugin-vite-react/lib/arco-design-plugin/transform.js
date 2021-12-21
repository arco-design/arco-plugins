"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformJsFiles = exports.transformCssFile = void 0;
const parser = __importStar(require("@babel/parser"));
const types = __importStar(require("@babel/types"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const helper_module_imports_1 = require("@babel/helper-module-imports");
const config_1 = require("./config");
const utils_1 = require("./utils");
function transformCssFile({ id, theme, }) {
    if (theme) {
        const matches = (0, utils_1.pathMatch)(id, config_1.fullCssMatchers);
        if (matches) {
            const themeCode = (0, utils_1.readFileStrSync)(`${theme}/css/arco.css`);
            if (themeCode !== false) {
                return {
                    code: themeCode,
                    map: null,
                };
            }
        }
    }
    return undefined;
}
exports.transformCssFile = transformCssFile;
function transformJsFiles({ code, id, theme, style, styleOptimization, sourceMaps, }) {
    if (style === false || !/\.(js|jsx|ts|tsx)$/.test(id)) {
        return undefined;
    }
    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
    });
    (0, traverse_1.default)(ast, {
        enter(path) {
            const { node } = path;
            // import { Button, InputNumber, TimeLine } from '@arco-design/web-react'
            if (types.isImportDeclaration(node)) {
                const { value } = node.source;
                if (value === config_1.libraryName) {
                    // lazy load (css files don't support layload with theme)
                    if (styleOptimization && (style !== 'css' || !theme)) {
                        node.specifiers.forEach((spec) => {
                            if (types.isImportSpecifier(spec)) {
                                const importedName = spec.imported.name;
                                const stylePath = `${value}/es/${importedName}/style/${style === 'css' ? 'css.js' : 'index.js'}`;
                                (0, helper_module_imports_1.addSideEffect)(path, stylePath);
                            }
                        });
                    }
                    // import css bundle file
                    else if (style === 'css') {
                        (0, helper_module_imports_1.addSideEffect)(path, `${value}/dist/css/arco.css`);
                    }
                    // import less bundle file
                    else {
                        (0, helper_module_imports_1.addSideEffect)(path, `${value}/dist/css/index.less`);
                    }
                }
            }
        },
    });
    return (0, generator_1.default)(ast, { sourceMaps, sourceFileName: id });
}
exports.transformJsFiles = transformJsFiles;
