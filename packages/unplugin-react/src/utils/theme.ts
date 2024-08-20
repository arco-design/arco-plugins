import path from 'path';
import fs from 'fs';

export function getThemeComponents(theme: string): string[] {
  try {
    const packageRootDir = path.dirname(
      require.resolve(`${theme}/package.json`, {
        paths: [process.cwd()],
      })
    );
    const themeComponentDirPath = `${packageRootDir}/components`;
    const ret = fs.readdirSync(themeComponentDirPath);
    return ret || [];
  } catch {
    return [];
  }
}
