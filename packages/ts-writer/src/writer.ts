import path from 'node:path';
import ts from 'typescript';
import { t } from './t';
import type { Commands, KeysOf, SourceTemplateData } from './types';
import { readCompilerOptions } from './util/read-compiler-options';

export class TsWriter {
  /**
   * A simple map of all the sources that have been written.
   *
   * The string array represents the result of each write call, **not each written line**.
   */
  private sources: Record<string, string[]> = {};
  private outputs: Record<string, string> = {};
  private host: ts.CompilerHost;
  private compilerOptions: ts.CompilerOptions;

  constructor(optionsOrTsconfigPath: ts.CompilerOptions | string) {
    this.compilerOptions =
      typeof optionsOrTsconfigPath === 'string'
        ? readCompilerOptions(optionsOrTsconfigPath)
        : optionsOrTsconfigPath;

    // Adds outDir to allows multiple files to be written
    this.compilerOptions.outDir ??= '/';
    // Generates following d.ts declaration files.
    this.compilerOptions.declaration ??= true;
    // Sets default compiler options for nodejs bundling
    this.compilerOptions.moduleResolution ??= ts.ModuleResolutionKind.NodeJs;
    this.compilerOptions.module ??= ts.ModuleKind.CommonJS;
    this.compilerOptions.target ??= ts.ScriptTarget.ES2022;

    this.host = ts.createCompilerHost(this.compilerOptions, false);
    this.host.readFile = (file) => this.sources[file]?.join('');
    this.host.writeFile = (file, content) =>
      (this.outputs[
        // Normalize paths to avoid inconsistency
        this.compilerOptions.outDir
          ? path.relative(this.compilerOptions.outDir, file)
          : file
      ] = content);
  }

  transpile() {
    // Flush the outputs before transpiling (maybe) again
    this.outputs = {};

    ts.createProgram(
      // Gets all source filenames
      Object.keys(this.sources),
      this.compilerOptions,
      this.host
    ).emit();

    return this.outputs;
  }

  write<D extends SourceTemplateData, P extends KeysOf<D>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number]>[]
  ) {
    (this.sources[data.filename] ??= []).push(t<D, P>(template, data, ...keys));
  }

  /** Write on top of the file */
  head<D extends SourceTemplateData, P extends KeysOf<D>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number]>[]
  ) {
    (this.sources[data.filename] ??= []).unshift(t<D, P>(template, data, ...keys));
  }

  writeUnique<D extends SourceTemplateData, P extends KeysOf<D>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number]>[]
  ) {
    const str = t<D, P>(template, data, ...keys);
    const file = (this.sources[data.filename] ??= []);

    if (!file.includes(str)) {
      file.push(str);
    }
  }

  /** Write on top of the file */
  headUnique<D extends SourceTemplateData, P extends KeysOf<D>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number]>[]
  ) {
    const str = t<D, P>(template, data, ...keys);
    const file = (this.sources[data.filename] ??= []);

    if (!file.includes(str)) {
      file.unshift(str);
    }
  }
}
