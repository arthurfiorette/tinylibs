/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { TsWriter } from '../src';

describe('tests ts writer', () => {
  it('tests events', () => {
    const writer = new TsWriter({});

    const readFileSpy = jest.fn();
    const writeFileSpy = jest.fn();
    const createProgramSpy = jest.fn();
    const programEmitSpy = jest.fn();
    const generateSpy = jest.fn();

    writer.on('readFile', readFileSpy);
    writer.on('writeFile', writeFileSpy);
    writer.on('createProgram', createProgramSpy);
    writer.on('programEmit', programEmitSpy);
    writer.on('generate', generateSpy);

    writer.write`
${{
  filename: 'test.ts'
}}

export function test(): MyStringType {
  return 'test';
}

`;

    writer.writeHeader`
${{
  filename: 'test.ts',
  path: './test-other-file'
}}

import { MyStringType } from '${'path'}';
    `;

    writer.transpile();

    expect(readFileSpy).toHaveBeenCalledWith('test.ts');

    expect(writeFileSpy).toHaveBeenCalledTimes(2);
    expect(writeFileSpy).toHaveBeenNthCalledWith(1, 'test.js', expect.any(String));
    expect(writeFileSpy).toHaveBeenNthCalledWith(2, 'test.d.ts', expect.any(String));

    expect(createProgramSpy).toHaveBeenCalledTimes(1);

    expect(programEmitSpy).toHaveBeenCalledTimes(1);
    expect(programEmitSpy).toHaveBeenCalledWith({
      emitSkipped: false,
      diagnostics: [],
      emittedFiles: undefined,
      sourceMaps: undefined
    });

    expect(generateSpy).toHaveBeenCalledTimes(2);
    expect(generateSpy).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      expect.any(Array),
      { filename: 'test.ts' },
      [],
      'normal'
    );
    expect(generateSpy).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.any(Array),
      { filename: 'test.ts', path: './test-other-file' },
      ['path'],
      'header'
    );

    expect(writer.outputs).toStrictEqual({
      'test.js':
        '"use strict";\n' +
        'Object.defineProperty(exports, "__esModule", { value: true });\n' +
        'exports.test = void 0;\n' +
        'function test() {\n' +
        "    return 'test';\n" +
        '}\n' +
        'exports.test = test;\n',
      'test.d.ts':
        "import { MyStringType } from './test-other-file';\n" +
        'export declare function test(): MyStringType;\n'
    });
  });
});
