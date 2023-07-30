/**
 * Serializes any give value into a string. Used internally by the `hash` function.
 *
 * @example
 *
 * ```ts
 * class B {}
 *
 * serialize(B); // functionclass B{}
 * ```
 *
 * **Note**: Symbols uniqueness are not guaranteed, as they are transformed to strings.
 *
 * @param property The property to Serialize
 * @returns A unique string representation of the property
 * @see https://tinylibs.js.org/packages/object-code/
 */
export function serialize<T>(value?: T, seen = new WeakMap()): string {
  const type = typeof value;

  if (value && type === 'object' && !(value instanceof Date || value instanceof RegExp)) {
    const copy = (Array.isArray(value) ? [] : {}) as Record<keyof T, string>;

    const keys = Object.keys(value).sort((a, b) => (a > b ? 1 : -1));
    let i = keys.length;

    while (i--) {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const key = keys[i]! as keyof T;
      const val = value[key]!;

      // Uses an internal WeakMap to keep track of previous seen values
      // and avoid circular references serializations which would cause
      // an infinite loop.
      if (
        typeof val === 'object' &&
        val !== null &&
        !(val instanceof Date || val instanceof RegExp)
      ) {
        if (seen.has(val)) {
          continue;
        }

        // Only add the value to the seen list if it's an object
        seen.set(val, true);
      }

      copy[key] = serialize(val, seen);
    }

    return String(value.constructor) + JSON.stringify(copy, keys);
  }

  return type + String(value);
}
