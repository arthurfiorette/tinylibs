import path from 'node:path';
import ts from 'typescript';

/**
 * Attempts to read the compiler options from a tsconfig file. Also resolving its
 * following extends.
 */
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
