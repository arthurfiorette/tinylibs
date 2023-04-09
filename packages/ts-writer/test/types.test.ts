import type { KeysOf } from '../src/types';

describe('types', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const a = {
    numbers: [[1], [2], [3], [4], [5]]
  } as const;

  it('tests', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const c: KeysOf<{ f: ' asd'; a: 1; b: { c: 2 }; d: [1, 2, 3] }> = 'd.@';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const d: KeysOf<[[1], [2], [3]]> = '@.0';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const e: KeysOf<typeof a> = 'numbers.@.@';

    expect(c).toBe(c);
    expect(d).toBe(d);
    expect(e).toBe(e);
  });
});
