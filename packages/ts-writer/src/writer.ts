import path from 'node:path';
import ts from 'typescript';
import { t } from './t';
import type { Commands, KeysOf, SourceTemplateData, TemplateHelper } from './types';
import { readCompilerOptions } from './util/read-compiler-options';

export class TsWriter<
  H extends readonly TemplateHelper[] | undefined = readonly TemplateHelper[] | undefined
> {
  /**
   * A simple map of all the sources that have been written.
   *
   * The string array represents the result of each write call, **not each written line**.
   */
  readonly sources: Record<string, string[]> = {};
  private outputs: Record<string, string> = {};
  readonly host: ts.CompilerHost;
  readonly compilerOptions: ts.CompilerOptions;

  /**
   * Constructs a new TsWriter instance.
   *
   * @param optionsOrTsconfigPath Either the compiler options or the path to a tsconfig
   *   file.
   */
  constructor(
    optionsOrTsconfigPath: ts.CompilerOptions | string,
    readonly helpers?: H
  ) {
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

  /**
   * Collects all the written files and uses typescript to transpile them.
   *
   * @returns The result of the transpilation from typescript.
   */
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

  /**
   * Generates the code to be written in the provided file. The first argument is an
   * object with the variables to be used in the template, as well the filename. The rest
   * of the arguments are the templates to be written in the file.
   */
  write<D extends SourceTemplateData<H>, P extends KeysOf<Omit<D, 'helpers'>>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number], D & { helpers: H }>[]
  ) {
    data.helpers ??= this.helpers;

    (this.sources[data.filename] ??= []).push(
      t(template, data as D & { helpers: H }, ...keys)
    );
  }

  /**
   * Generates the code to be written **ON TOP** in the provided file. The first argument
   * is an object with the variables to be used in the template, as well the filename. The
   * rest of the arguments are the templates to be written in the file.
   */
  head<D extends SourceTemplateData<H>, P extends KeysOf<Omit<D, 'helpers'>>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number], D & { helpers: H }>[]
  ) {
    data.helpers ??= this.helpers;

    (this.sources[data.filename] ??= []).unshift(
      t(template, data as D & { helpers: H }, ...keys)
    );
  }

  /**
   * Generates the code to be written in the provided file **ONLY IF NOT ALREADY
   * WRITTEN**. The first argument is an object with the variables to be used in the
   * template, as well the filename. The rest of the arguments are the templates to be
   * written in the file.
   */
  writeUnique<D extends SourceTemplateData<H>, P extends KeysOf<Omit<D, 'helpers'>>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number], D & { helpers: H }>[]
  ) {
    data.helpers ??= this.helpers;

    const str = t(template, data as D & { helpers: H }, ...keys);
    const file = (this.sources[data.filename] ??= []);

    if (!file.includes(str)) {
      file.push(str);
    }
  }

  /**
   * Generates the code to be written **ON TOP** in the provided file **ONLY IF NOT
   * ALREADY WRITTEN**. The first argument is an object with the variables to be used in
   * the template, as well the filename. The rest of the arguments are the templates to be
   * written in the file.
   */
  headUnique<D extends SourceTemplateData<H>, P extends KeysOf<Omit<D, 'helpers'>>[]>(
    template: TemplateStringsArray,
    data: D,
    ...keys: Commands<P[number], D & { helpers: H }>[]
  ) {
    data.helpers ??= this.helpers;

    const str = t(template, data as D & { helpers: H }, ...keys);
    const file = (this.sources[data.filename] ??= []);

    if (!file.includes(str)) {
      file.unshift(str);
    }
  }
}
