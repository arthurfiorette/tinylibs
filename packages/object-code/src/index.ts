/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Serializes any give value into a unique string.
 *
 * @param property The property to Serialize
 * @returns A unique string representation of the property
 */
export function serialize<T>(value?: T): string {
  const type = typeof value;

  if (!value || type !== 'object' || value instanceof Date || value instanceof RegExp) {
    return `${type}${String(value)}`;
  }

  const copy = (Array.isArray(value) ? [] : {}) as Record<keyof T, string>;

  for (const key in value) {
    copy[key] = serialize(value[key]);
  }

  return `${
    //@ts-expect-error ignore if not present
    value.constructor
  }${JSON.stringify(copy, Object.keys(value).sort())}`;
}

/**
 * Hashes an value into a signed integer. Inspired from `string-hash`.
 *
 * @param serialized The value to be hashed
 * @returns The hashed number value
 * @see https://www.npmjs.com/package/string-hash
 */
export function hashCode(val?: unknown): number {
  val = serialize(val);

  let hash = 5381;

  //@ts-expect-error faster for in inside strings
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const index in val as string) {
    hash = (hash * 33) ^ (val as string).charCodeAt(index as unknown as number);
  }

  // Unsign the number
  return hash >>> 0;
}
