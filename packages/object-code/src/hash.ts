import { serialize } from './serialize';

/**
 * Hashes an value into a signed integer.
 *
 * Inspired from `string-hash` package.
 *
 * @param serialized The value to be hashed
 * @returns The hashed number value
 * @see https://www.npmjs.com/package/string-hash
 */
export function hash(val?: unknown): number {
  val = serialize(val);

  let hash = 5381;

  //@ts-expect-error faster for in inside strings
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const index in val as string) {
    hash = (hash * 33) ^ (val as string).charCodeAt(index as unknown as number);
  }

  return hash;
}
