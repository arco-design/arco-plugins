declare type TransformedResult = undefined | {
    code: string;
    map: any;
};
declare type Style = boolean | 'css';
export declare function transformCssFile({ id, theme, }: {
    code: string;
    id: string;
    theme: string;
}): TransformedResult;
export declare function transformJsFiles({ code, id, theme, style, styleOptimization, sourceMaps, }: {
    code: string;
    id: string;
    theme?: string;
    style: Style;
    styleOptimization: boolean;
    sourceMaps: boolean;
}): TransformedResult;
export {};
