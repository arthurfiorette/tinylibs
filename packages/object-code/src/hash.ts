import { mix, normalizeNumber, sortNumbers, sortPairsByKey } from './util';

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
  let h = 5381; // DJB2 seed

  // Handle objects and array-like structures
  if (typeof val === 'object' && val !== null) {
    const hasEntries = typeof (val as any).entries === 'function';
    const hasEnumerableKeys = Object.keys(val).length > 0;
    const shouldHashAsObject =
      val.toString === Object.prototype.toString ||
      val.toString === Array.prototype.toString;

    // Hash objects with enumerable keys OR entries() method (Map, Set, FormData, etc.)
    if (shouldHashAsObject || (hasEntries && !hasEnumerableKeys)) {
      if (!seen) {
        seen = new WeakSet();
      }
      seen.add(val);

      // Get key-value pairs: use entries() for special objects, Object.keys() for regular ones
      const pairs: [unknown, unknown][] =
        hasEntries && !hasEnumerableKeys
          ? Array.from((val as any).entries())
          : Object.keys(val)
              .sort(sortNumbers)
              .map((key) => [key, val[key as keyof typeof val]]);

      // Sort by key for consistent hashing (only needed for entries() path)
      if (hasEntries && !hasEnumerableKeys) {
        pairs.sort(sortPairsByKey);
      }

      // Hash all key-value pairs
      for (let i = 0; i < pairs.length; i++) {
        const [key, value] = pairs[i]!;

        h = mix(h, hash(key, seen));

        // Track circular references for object values
        if (
          typeof value === 'object' &&
          value !== null &&
          (value.toString === Object.prototype.toString ||
            value.toString === Array.prototype.toString)
        ) {
          if (seen.has(value)) {
            continue;
          }
          seen.add(value);
        }

        h = mix(h, hash(value, seen));
      }

      // Hash the constructor for type differentiation
      h = mix(h, hash(val.constructor, seen));

      return h;
    }
  }

  // Hash primitives efficiently - avoid string concatenation overhead
  const type = typeof val;

  // Hash the type first to differentiate types
  for (let i = 0; i < type.length; i++) {
    h = mix(h, type.charCodeAt(i));
  }

  if (val instanceof Date) {
    // Hash dates by their numeric timestamp directly
    return mix(h, val.getTime());
  }

  if (type === 'number') {
    // Normalize special numbers to prevent collisions
    return mix(h, normalizeNumber(val as number));
  }

  if (type === 'boolean') {
    // Hash booleans as distinct values
    return mix(h, val ? 1 : 0);
  }

  // For other types, get string representation
  let toHash: string;

  // Handles null prototype objects and symbols
  try {
    toHash = String(val);
  } catch {
    toHash = Object.prototype.toString.call(val);
  }

  // Hash the string representation
  for (let i = 0; i < toHash.length; i++) {
    h = mix(h, toHash.charCodeAt(i));
  }

  return h;
}
