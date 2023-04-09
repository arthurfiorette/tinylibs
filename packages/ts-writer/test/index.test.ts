/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { t } from '../src';

describe(t, () => {
  it('works with each', () => {
    expect(
      t`${{ array: [1, 2, 3, 4] }}[${['each', 'array']}${'array.@'},${['/each']}]`
    ).toBe('[1,2,3,4,]');
  });

  it('works with each and ifs', () => {
    expect(
      t`${{ array: [1, 2, 3, 4], truthy: true, falsy: false }}${['if', 'truthy']}[${[
        'each',
        'array'
      ]}${'array.@'}-${['/each']}]${['/if']}${['if', 'falsy']}[${[
        'each',
        'array'
      ]}${'array.@'}+${['/each']}]${['/if']}`
    ).toBe('[1-2-3-4-]');
  });

  it('works with if/else', () => {
    expect(
      t`${{ truthy: true, falsy: false }}${['if', 'truthy']}1${['else']}2${['/if']}${[
        'if',
        'falsy'
      ]}3${['else']}4${['/if']}${['if', 'truthy']}5${['/if']}${['if', 'falsy']}6${[
        '/if'
      ]}`
    ).toBe('145');
  });

  it('works with deep if/else', () => {
    expect(
      t`${{ truthy: true, falsy: false }}${['if', 'truthy']}1${['if', 'falsy']}2${[
        'else'
      ]}3${['/if']}4${['else']}5${['if', 'truthy']}6${['else']}7${['/if']}8${['/if']}`
    ).toBe('134');
  });

  it('throws when each is not an array', () => {
    expect(() => t`${{ array: 1 }}[${['each', 'array']}1${['/each']}]`).toThrowError(
      'Key "array" is not an array'
    );
  });

  it('throws with unknown data in parameters', () => {
    expect(() => t`${{ array: 1 }}${['asdf' as '/each']}`).toThrowError(
      "Invalid command: ['asdf']"
    );
  });
});
