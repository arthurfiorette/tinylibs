import { KeysOf, replaceArrayIndexes } from '../../src';

describe(replaceArrayIndexes, () => {
  it('should replace array indexes', () => {
    const obj = { a: { b: [{ i: 1 }, { i: 2 }, { i: 3 }] } };

    for (const i of [0, 1, 2]) {
      expect(
        replaceArrayIndexes<typeof obj, KeysOf<typeof obj>[]>(
          ['a.b.@.i', 'a.b.1.i'],
          'a.b',
          i
        )
      ).toEqual([`a.b.${i}.i`, 'a.b.1.i']);
    }
  });
});
