import { serialize } from './serialize';

/**
 * Hashes an value into a signed integer.
 *
 * Inspired from `string-hash` package.
 *
 * @param val The value to be hashed
 * @returns The signed integer result from the provided value
 * @see https://www.npmjs.com/package/string-hash
 */
export function hash(val?: unknown): number {
  val = serialize(val);

  let hash = 5381;
  let index = 0;

  while (index < (val as string).length) {
    hash = (hash * 33) ^ (val as string).charCodeAt(index++);
  }

  return hash;
}
