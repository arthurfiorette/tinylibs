import type { SourceTemplate } from './source-template';

export type TsWriterVariables = {
  [x: string]: unknown;
};

export type TsWriterArgument<V extends TsWriterVariables> =
  | Extract<keyof V, string>
  | `${Extract<keyof V, string>}.${string}`
  | SourceTemplate
  | SourceTemplate[];
