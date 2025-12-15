import { hash } from '../src';
import { values } from './values';

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
});

it('expects the same return for the same call', () => {
  for (const val of values) {
    expect(hash(val)).toBe(hash(val));
  }
});

it('tests for circular references', () => {
  const obj = {} as { a: unknown };
  obj.a = obj;

  expect(hash(obj)).toBe(hash(obj));
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
