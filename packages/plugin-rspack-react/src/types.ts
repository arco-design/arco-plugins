/* eslint-disable @typescript-eslint/ban-types */
import type { LoaderContext as WebpackLoaderContext } from 'webpack';
import type { LoaderContext as RspackLoaderContext } from '@rspack/core';

export interface ArcoDesignPluginOptions {
  style?: string | boolean;
  libraryDirectory?: string;
  iconBox?: string;
  removeFontFace?: boolean;
  defaultLanguage?: string;
  theme?: string;
}
export type LoaderContext<T> =
  | WebpackLoaderContext<T>
  | (Omit<RspackLoaderContext, 'getOptions'> & { getOptions(schema?: any): T });

export interface LoaderDefinitionFunction<OptionsType = {}, ContextAdditions = {}> {
  (
    this: LoaderContext<OptionsType> & ContextAdditions,
    content: string,
    sourceMap?: unknown,
    additionalData?: Record<string, unknown>
  ): string | void | Buffer | Promise<string | Buffer>;
}

export type LoaderDefinition<OptionsType = {}> = LoaderDefinitionFunction<OptionsType>;
