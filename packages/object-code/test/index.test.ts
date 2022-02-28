import { hashCode, serialize } from '../src';
import { values } from './values';

describe('tests hashcode', () => {
  it('supports all values', () => {
    const set = new Set();

    for (const value of values) {
      set.add(hashCode(value));
    }

    expect(set.size).toBe(values.length);
  });

  it('tests if the return type are numbers', () => {
    for (const val of values) {
      expect(typeof hashCode(val)).toBe('number');
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
      expect(hashCode(val)).toBe(hashCode(val));
    }
  });
});
