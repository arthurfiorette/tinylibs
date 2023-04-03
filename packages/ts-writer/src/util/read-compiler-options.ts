import path from 'node:path';
import ts from 'typescript';

/**
 * Attempts to read the compiler options from a tsconfig file. Also resolving its
 * following extends.
 */
export function readCompilerOptions(tsconfigPath: string) {
  let res: ReturnType<typeof ts.readConfigFile> | ts.ParsedCommandLine =
    ts.readConfigFile(tsconfigPath, (p) => ts.sys.readFile(p));

  if (res.error) {
    throw new Error(`Failed to read tsconfig file.`);
  }

  res = ts.parseJsonConfigFileContent(
    res.config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath
  );

  if (res.errors.length) {
    throw new Error(`Failed to parse tsconfig file.`);
  }

  return res.options;
}
