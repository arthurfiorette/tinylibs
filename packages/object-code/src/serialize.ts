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
export function serialize<T>(value?: T): string {
  const type = typeof value;

  if (value && type === 'object' && !(value instanceof Date || value instanceof RegExp)) {
    const copy = (Array.isArray(value) ? [] : {}) as Record<keyof T, string>;

    const keys = Object.keys(value).sort((a, b) => (a > b ? 1 : -1));
    let i = keys.length;

    while (i--) {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const key = keys[i]! as keyof T;
      copy[key] = serialize(value[key]);
    }

    return (
      //@ts-expect-error ignore if not present
      String(value.constructor) + JSON.stringify(copy, keys)
    );
  }

  return type + String(value);
}
