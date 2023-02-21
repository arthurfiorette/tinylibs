import path from 'path';
import ts from 'typescript';

export function readCompilerOptions(tsconfigPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { config, error } = ts.readConfigFile(tsconfigPath, (p) => ts.sys.readFile(p));

  if (error) {
    throw new Error(`Failed to read tsconfig file.`);
  }

  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath
  );

  if (errors.length) {
    throw new Error(`Failed to parse tsconfig file.`);
  }

  return options;
}
