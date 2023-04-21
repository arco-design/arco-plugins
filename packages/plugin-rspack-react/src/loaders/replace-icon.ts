import type { LoaderDefinitionFunction } from 'webpack';

export interface ReplaceIconLoaderOptions {
  iconBoxLib: Record<string, string>;
  iconBoxDirname: string;
}

// 替换Arco默认图标
const ReplaceIconLoader: LoaderDefinitionFunction<ReplaceIconLoaderOptions> = function (content) {
  const { iconBoxLib, iconBoxDirname } = this.getOptions();

  if (!iconBoxLib) return content;

  const matches = this.resourcePath.match(
    /@arco-design\/web-react\/icon\/react-icon\/([^/]+)\/index\.js$/
  );
  if (matches && iconBoxLib[matches[1]]) {
    return `export { default } from '${iconBoxDirname}/esm/${matches[1]}/index.js';`;
  }
  return content;
};

module.exports = ReplaceIconLoader;
module.exports.default = ReplaceIconLoader;
