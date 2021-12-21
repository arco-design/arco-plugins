import type { Plugin } from 'vite';
declare type Vars = Record<string, any>;
declare type Style = boolean | 'css';
interface PluginOption {
    theme?: string;
    iconBox?: string;
    modifyVars?: Vars;
    style?: Style;
}
export default function vitePluginArcoImport(options?: PluginOption): Plugin;
export {};
