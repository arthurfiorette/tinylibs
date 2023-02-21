import { stringify } from 'javascript-stringify';
import path from 'path';
import ts from 'typescript';
import { TsWriterEmitter } from './events';
import { SourceTemplate } from './source-template';
import { readCompilerOptions } from './tsconfig';
import type { TsWriterArgument, TsWriterVariables } from './types';

export class TsWriter extends TsWriterEmitter {
  /** Currently collected sources */
  readonly sources: Record<string, string> = {};

  /** Currently collected sources */
  readonly outputs: Record<string, string> = {};

  /** The compiler host used to read and write from {@link sources} and {@link outputs} */
  readonly host: ts.CompilerHost;

  /** The resolved Typescript API compiler options */
  readonly compilerOptions: ts.CompilerOptions;

  constructor(optionsOrTsconfigPath: ts.CompilerOptions | string) {
    super();

    this.compilerOptions =
      typeof optionsOrTsconfigPath === 'string'
        ? readCompilerOptions(optionsOrTsconfigPath)
        : optionsOrTsconfigPath;

    // Adds outDir to allows multiple files to be written
    this.compilerOptions.outDir ??= 'source-writer-output/';
    // Generates following d.ts declaration files.
    this.compilerOptions.declaration ??= true;

    // Sets default compiler options for nodejs bundling
    this.compilerOptions.moduleResolution ??= ts.ModuleResolutionKind.NodeJs;
    this.compilerOptions.module ??= ts.ModuleKind.CommonJS;
    this.compilerOptions.target ??= ts.ScriptTarget.ES2022;

    this.host = ts.createCompilerHost(this.compilerOptions, false);

    this.host.readFile = (file) => {
      this.emit('readFile', file);
      return this.sources[file];
    };

    this.host.writeFile = (file, content) => {
      if (this.compilerOptions.outDir) {
        file = path.relative(this.compilerOptions.outDir, file);
      }

      this.emit('writeFile', file, content);

      this.outputs[file] ??= '';
      this.outputs[file] += content;
    };
  }

  /** Runs all source files into a {@link ts.Program} and returns the transpiled result. */
  transpile(this: this) {
    const program = ts.createProgram(
      // Gets all source filenames
      Object.keys(this.sources),
      this.compilerOptions,
      this.host
    );

    this.emit('createProgram', program);

    const result = program.emit();

    this.emit('programEmit', result);

    return this.outputs;
  }

  /**
   * Builds a piece of source code from a template string that can be reused inside
   * {@link write} and {@link writeHede}
   */
  template<V extends TsWriterVariables>(
    this: this,
    template: TemplateStringsArray,
    variables: V,
    ...parameters: TsWriterArgument<V>[]
  ): SourceTemplate {
    return new SourceTemplate(
      template.reduce((codeblock, code, index) => {
        if (!code.trim()) {
          return codeblock;
        }

        codeblock += code;

        const argName = parameters[index - 1];

        if (!argName) {
          return codeblock;
        }

        // Checks for array of template results
        if (Array.isArray(argName) && argName.every(SourceTemplate.match)) {
          codeblock += `\n${argName.join('\n')}\n`;
          return codeblock;
        }

        // Checks for template result
        if (SourceTemplate.match(argName)) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          codeblock += `\n${argName}\n`;
          return codeblock;
        }

        const argValue = variables[argName];

        // Simple property that does not need to be stringified
        if (
          typeof argValue === 'boolean' ||
          typeof argValue === 'string' ||
          typeof argValue === 'number' ||
          typeof argValue === 'symbol' ||
          typeof argValue === 'undefined'
        ) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          codeblock += String(argValue);
          return codeblock;
        }

        // Is a deep string that results in a unknown runtime value
        // So use javascript-stringify to stringify it
        codeblock += stringify(
          argName
            .split('.')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
            .reduce((acc, curr) => (acc as Record<string, any>)[curr], variables)
        );

        return codeblock;
      }, '')
    );
  }

  /**
   * Appends to the **END** of the source. For import or type statements, you should
   * prefer {@link writeHeader}
   */
  write<V extends TsWriterVariables & { filename: string }>(
    this: this,
    template: TemplateStringsArray,
    variables: V,
    ...args: TsWriterArgument<V>[]
  ): this {
    const result = this.template(template, variables, ...args);

    this.emit('generate', result, template, variables, args, 'normal');

    this.sources[variables.filename] ??= '';
    this.sources[variables.filename] += result;

    return this;
  }

  /**
   * Appends to the **START** of the source. Useful for import statements or typing
   * annotations.
   *
   * @see {@link write}
   */
  writeHeader<V extends TsWriterVariables & { filename: string }>(
    this: this,
    template: TemplateStringsArray,
    variables: V,
    ...args: TsWriterArgument<V>[]
  ): this {
    const result = this.template(template, variables, ...args);

    this.emit('generate', result, template, variables, args, 'header');

    this.sources[variables.filename] ??= '';
    this.sources[variables.filename] =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-plus-operands
      result + this.sources[variables.filename]!;

    return this;
  }

  /** Clears all sources and outputs */
  clear() {
    //@ts-expect-error - should be readonly
    this.outputs = {};
    //@ts-expect-error - should be readonly
    this.sources = {};
  }
}
