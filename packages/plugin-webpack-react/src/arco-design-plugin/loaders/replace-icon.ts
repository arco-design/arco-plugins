import { getOptions } from 'loader-utils';
import { LoaderDefinitionFunction } from 'webpack';

// 替换Arco默认图标
const ReplaceIconLoader: LoaderDefinitionFunction = function (content) {
  const { iconBoxLib, iconBoxDirname } = getOptions(this) as unknown as {
    iconBoxLib: Record<string, string>;
    iconBoxDirname: string;
  };

  if (!iconBoxLib) {
    return content;
  }

  const matches = this.resourcePath.match(
    /@arco-design\/web-react\/icon\/react-icon\/([^/]+)\/index\.js$/
  );
  if (matches && iconBoxLib[matches[1]]) {
    return `export {default} from '${iconBoxDirname}/esm/${matches[1]}/index.js';`;
  }
  return content;
};

module.exports = ReplaceIconLoader;
module.exports.default = ReplaceIconLoader;
