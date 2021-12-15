"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathMatch = exports.getThemeComponentList = exports.isModExist = exports.readFileStrSync = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
// read file content
function readFileStrSync(path) {
    try {
        const resolvedPath = require.resolve(path);
        return (0, fs_1.readFileSync)(resolvedPath).toString();
    }
    catch (error) {
        return false;
    }
}
exports.readFileStrSync = readFileStrSync;
// check if a module existed
const modExistObj = {};
function isModExist(path) {
    if (modExistObj[path] === undefined) {
        try {
            const resolvedPath = require.resolve(path);
            (0, fs_1.readFileSync)(resolvedPath);
            modExistObj[path] = true;
        }
        catch (error) {
            modExistObj[path] = false;
        }
    }
    return modExistObj[path];
}
exports.isModExist = isModExist;
// the theme package's component list
const componentsListObj = {};
function getThemeComponentList(theme) {
    if (!theme)
        return [];
    if (!componentsListObj[theme]) {
        try {
            const packageRootDir = (0, path_1.dirname)(require.resolve(`${theme}/package.json`));
            const dirPath = `${packageRootDir}/components`;
            componentsListObj[theme] = (0, fs_1.readdirSync)(dirPath) || [];
        }
        catch (error) {
            componentsListObj[theme] = [];
        }
    }
    return componentsListObj[theme];
}
exports.getThemeComponentList = getThemeComponentList;
// filePath match
function pathMatch(path, conf) {
    const [regStr, order = 0] = conf;
    const reg = new RegExp(regStr);
    const matches = path.match(reg);
    if (!matches)
        return false;
    return matches[order];
}
exports.pathMatch = pathMatch;
