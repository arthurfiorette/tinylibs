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
      t`${{ truthy: true, falsy: false }}
      ${['if', 'truthy']}
      
      ${['else']}
      
      ${['/if']}`
    ).toBe('[1-2-3-4-]');
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
