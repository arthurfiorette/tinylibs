/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { consume, t } from '../src';

describe(t, () => {
  it('throws on data before text', () => {
    expect(() => t`text ${{ data: 'before test' }}`).toThrowError(
      'Cannot have text before data "text "'
    );
  });

  it('works calling consume with out of range indexes', () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect(consume<{}, []>(-1, 999, [], {}, [])).toBe('');
  });

  it('works with deep arrays', () => {
    expect(
      t`${{
        array: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ]
      }}${['each', 'array']}[${['each', 'array.@']}>${'array.@.@'}<${['/each']}]${[
        '/each'
      ]}`
    ).toBe('[>1<>2<>3<][>4<>5<>6<][>7<>8<>9<]');
  });
});
