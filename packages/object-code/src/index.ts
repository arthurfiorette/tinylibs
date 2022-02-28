/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Serializes any give value into a unique string.
 *
 * @param property The property to Serialize
 * @returns A unique string representation of the property
 * @implNote - As symbols are intended to be unique, an random number is added at the end of the stringified symbol.
 *  - Dates are converted using the `Date#getTime` function
 *  - Objects or arrays will have a `!` prefix to prevent conflict with literal values.
 *  - Objects will be sorted before being converted to a string, so that:
 *
 * ```js
 * serialize({ a: 1, b: 2 }) === serialize({ b: 2, a: 1 })
 * ```
 */
export function serialize<T>(value?: T): string {
  const type = typeof value;

  if (value && type === 'object' && !(value instanceof Date || value instanceof RegExp)) {
    const copy = (Array.isArray(value) ? [] : {}) as Record<keyof T, string>;

    for (const key in value) {
      copy[key as keyof T] = serialize(value[key]);
    }

    return `${
      //@ts-expect-error ignore if not present
      value.constructor
    }${JSON.stringify(copy, Object.keys(value).sort())}`;
  }

  return `${type}${String(value)}`;
}

/**
 * Hashes an value into a signed integer.
 *
 * @param serialized The value to be hashed
 * @returns The hashed number value
 *
 *   Inspired from [string-hash](https://www.npmjs.com/package/string-hash) package
 */
export function hashCode(val?: unknown): number {
  val = serialize(val);

  let hash = 5381;

  for (let i = 0; i < (val as string).length; i++) {
    hash = (hash * 33) ^ (val as string).charCodeAt(i);
  }

  // Unsign the number
  return hash >>> 0;
}
