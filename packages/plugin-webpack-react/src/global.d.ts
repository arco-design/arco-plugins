import { ArcoDesignPluginOptions } from './arco-design-plugin/interface';

declare global {
  interface arcoDesignPlugin {
    options: ArcoDesignPluginOptions;
  }
}

export {};
