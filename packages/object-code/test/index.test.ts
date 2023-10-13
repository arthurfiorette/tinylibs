import { hash } from '../src';
import { values } from './values';

describe('tests', () => {
  it('supports all values', () => {
    const hashes = new Map();

    for (const value of values) {
      if (hashes.has(hash(value))) {
        console.log(value, hashes.get(hash(value)));
      }

      hashes.set(hash(value), value);
    }

    expect(hashes.size).toBe(values.length);
  });

  it('tests if the return type are numbers', () => {
    for (const val of values) {
      expect(typeof hash(val)).toBe('number');
    }

    expect.assertions(values.length);
  });

  it('expects the same return for the same call', () => {
    for (const val of values) {
      expect(hash(val)).toBe(hash(val));
    }

    expect.assertions(values.length);
  });

  it('tests for circular references', () => {
    const obj = {} as { a: unknown };
    obj.a = obj;

    expect(hash(obj)).toBe(hash(obj));
  });

  it('hashes a 2M object normally', () => {
    const example = {} as Record<string, { name: string; id: number }>;

    for (let i = 0; i < 2_000_000; i++) {
      example[i] = { name: 'test', id: i };
    }

    expect(typeof hash({ b: { example } })).toBe('number');
  });
});
