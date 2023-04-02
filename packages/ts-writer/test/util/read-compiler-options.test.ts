import path from 'path';
import { readCompilerOptions } from '../../src';

const tsconfigB = path.resolve(__dirname, './tsconfig-b.json');

describe(readCompilerOptions, () => {
  it('works even with extends', () => {
    expect(readCompilerOptions(tsconfigB)).toStrictEqual({
      allowJs: true,
      checkJs: false,
      configFilePath: tsconfigB
    });
  });
});
