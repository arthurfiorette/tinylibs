import { serialize } from './serialize';

/**
 * Hashes a given value into a unique number.
 *
 * This function accepts **ANY** kind of value, like `functions`, `classes`, `objects` and
 * so on.
 *
 * **Note**: Symbols uniqueness are not guaranteed, as they are transformed to strings.
 *
 * @example
 *
 * ```ts
 * class B {}
 *
 * const bHash = hash(B);
 * const bInstanceHash = hash(new B());
 * const bArrayHash = hash([B, new B(), new B(), { b: new B() }]);
 * const bBuilderHash = hash(() => B);
 * const bFactoryHash = hash(() => new B());
 * ```
 *
 * @param val The value to be hashed
 * @returns The signed integer result from the provided value
 * @see https://tinylibs.js.org/packages/object-code/
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
