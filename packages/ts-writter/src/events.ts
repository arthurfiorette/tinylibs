import { EventEmitter } from 'events';
import type { default as TypedEmitter } from 'typed-emitter';
import type ts from 'typescript';
import type { SourceTemplate } from './source-template';
import type { TsWriterArgument, TsWriterVariables } from './types';

export type TsWriterEvents = {
  readFile: (filename: string) => void;

  writeFile: (filename: string, content: string) => void;

  createProgram: (program: ts.Program) => void;

  programEmit: (result: ts.EmitResult) => void;

  generate: (
    generatedCode: SourceTemplate,
    template: TemplateStringsArray,
    variables: TsWriterVariables,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters: TsWriterArgument<any>[],
    mode: 'header' | 'normal'
  ) => void;
};

export class TsWriterEmitter extends (EventEmitter as {
  new (): TypedEmitter<TsWriterEvents>;
}) {}
