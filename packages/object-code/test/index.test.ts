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

  it('should hash FormData with different contents differently', () => {
    const form1 = new FormData();
    form1.append('a', '1');
    const hash1 = hash(form1);

    const form2 = new FormData();
    form2.append('a', '1');
    form2.append('b', '2');
    const hash2 = hash(form2);

    const form3 = new FormData();
    form3.append('b', '2');
    form3.append('a', '1');
    const hash3 = hash(form3);

    expect(hash1).not.toBe(hash2);
    // hash2 and hash3 should be equal because keys are sorted
    expect(hash2).toBe(hash3);
  });

  it('should hash identical FormData consistently', () => {
    const form1 = new FormData();
    form1.append('a', '1');
    form1.append('b', '2');

    const form2 = new FormData();
    form2.append('a', '1');
    form2.append('b', '2');

    expect(hash(form1)).toBe(hash(form2));
  });
});
