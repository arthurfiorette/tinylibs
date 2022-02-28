/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Serializes any give value into a unique string.
 *
 * @param property The property to Serialize
 * @returns A unique string representation of the property
 */
export function serialize<T>(value?: T): string {
  const type = typeof value;

  if (value && type == 'object' && !(value instanceof Date || value instanceof RegExp)) {
    const copy = (Array.isArray(value) ? [] : {}) as Record<keyof T, string>;

    for (const key in value) {
      copy[key] = serialize(value[key]);
    }

    return `${
      //@ts-expect-error ignore if not present
      value.constructor
    }${JSON.stringify(copy, Object.keys(value).sort())}`;
  }

  return `${type}${String(value)}`;
}
