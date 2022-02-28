import { hash, serialize } from '../src';
import { values } from './values';

describe('tests', () => {
  it('supports all values', () => {
    const set = new Set();

    for (const value of values) {
      set.add(hash(value));
    }

    expect(set.size).toBe(values.length);
  });

  it('tests if the return type are numbers', () => {
    for (const val of values) {
      expect(typeof hash(val)).toBe('number');
    }

    expect.assertions(values.length);
  });

  it('tests if the return type are strings', () => {
    for (const val of values) {
      expect(typeof serialize(val)).toBe('string');
    }

    expect.assertions(values.length);
  });

  it('expects the same return for the same call', () => {
    for (const val of values) {
      expect(hash(val)).toBe(hash(val));
    }

    expect.assertions(values.length);
  });
});
