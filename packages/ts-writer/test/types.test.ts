import type { KeysOf } from '../src/types';

describe('types', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const a = {
    numbers: [[1], [2], [3], [4], [5]]
  } as const;

  it('tests', () => {
    const c: KeysOf<{ f: ' asd'; a: 1; b: { c: 2 }; d: [1, 2, 3] }> = 'd.@';
    const d: KeysOf<[[1], [2], [3]]> = '@.0';
    const e: KeysOf<typeof a> = 'numbers.@.@';
    const f: KeysOf<{ f: { a: 1 } | undefined }> = 'f.a';
    const g: KeysOf<{ f: { a: 1 } | [{ b: 2 }] }> = 'f.a';
    const h: KeysOf<{ f: { a: 1 } | [{ b: 2 }] | undefined }> = 'f';

    expect(c).toBe(c);
    expect(d).toBe(d);
    expect(e).toBe(e);
    expect(f).toBe(f);
    expect(g).toBe(g);
    expect(h).toBe(h);
  });
});
