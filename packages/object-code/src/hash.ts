import { entriesToPairs, keysToPairs, sortNumbers } from './util';

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
export function hash(val: unknown, seen?: WeakSet<object>): number {
  let h = 5381;

  // Objects should be recursively hashed
  if (
    typeof val === 'object' &&
    val !== null &&
    (val.toString === Object.prototype.toString ||
      val.toString === Array.prototype.toString)
  ) {
    if (!seen) {
      seen = new WeakSet();
    }

    // Sort keys to keep the hash consistent
    const keys = Object.keys(val).sort(sortNumbers);

    // Build array of [key, value] pairs for unified processing
    let pairs: [unknown, unknown][];

    // If object has no enumerable keys but has entries() method,
    // use entries instead (e.g., FormData, URLSearchParams)
    if (keys.length === 0 && typeof (val as any).entries === 'function') {
      pairs = entriesToPairs(val);
      // Sort entries by key to ensure consistent hashing
      pairs.sort((a, b) => sortNumbers(String(a[0]), String(b[0])));
    } else {
      // Convert object keys to [key, value] pairs
      pairs = keysToPairs(keys, val);
    }

    for (let i = 0; i < pairs.length; i++) {
      const [key, value] = pairs[i]!;

      h = (h * 33) ^ hash(key, seen);

      // Uses an internal WeakMap to keep track of previous seen values
      // and avoid circular references serializations which would cause
      // an infinite loop.
      if (
        typeof value === 'object' &&
        value !== null &&
        (value.toString === Object.prototype.toString ||
          value.toString === Array.prototype.toString)
      ) {
        if (seen.has(value as object)) {
          continue;
        }

        seen.add(value as object);
      }

      // Hashes the value
      h = (h * 33) ^ hash(value, seen);
    }

    // Also hashes the constructor
    h = (h * 33) ^ hash(val.constructor, seen);

    return h;
  }

  let toHash = typeof val;

  try {
    if (val instanceof Date) {
      toHash += val.getTime();
    } else {
      toHash += String(val);
    }
  } catch (_error) {
    toHash += String(Object.assign({}, val));
  }

  for (let i = 0; i < toHash.length; i++) {
    h = (h * 33) ^ toHash.charCodeAt(i);
  }

  return h;
}
