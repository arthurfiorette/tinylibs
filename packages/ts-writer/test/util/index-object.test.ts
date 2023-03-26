import { indexObject } from '../../src';

describe(indexObject, () => {
  it('should index recursively an object', () => {
    const obj = { a: [2, { c: [3, 4] as const }] };
    const readonlyObj = obj as Readonly<typeof obj>;

    expect(indexObject('a.1.c.1', readonlyObj)).toBe(4);
    expect(indexObject('a.1.c.1', obj)).toBe(4);
  });

  it('crashes when accessing an invalid key', () => {
    expect(() => indexObject('a.1', { a: 1 })).toThrowError(
      'Key "1" in "a.1" does not exist inside data'
    );

    expect(() => indexObject('b', { a: 1 })).toThrowError(
      'Key "b" does not exist inside data'
    );

    expect(() => indexObject('b.c.d.e.f', { a: 1 })).toThrowError(
      'Key "b" does not exist inside data'
    );
  });

  it('crashes when using @ on non-array fields', () => {
    // Works normally with number keys
    expect(indexObject('a.1', { a: [1, 2, 3] })).toBe(2);

    // Crashes with @
    expect(() => indexObject('a.@', { a: [1, 2, 3] })).toThrowError(
      'Cannot use "@" as a key, have you forget to wrap it in a ${[\'each\']}'
    );
  });
});
