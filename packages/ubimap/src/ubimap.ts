import { KeyAlreadyExistsError, ValueAlreadyExistsError } from './errors';
import type { Join, PartialTuple } from './types';

/**
 * A safe, typed, enumerable bidirectional map that ensures unique values and supports
 * compound keys.
 *
 * @template K - A tuple representing the structure of the compound key, composed of
 *   strings or numbers.
 * @template V - The type of the values stored in the map. Defaults to `string`.
 * @template S - The type of the separator string used to join keys. Defaults to `' '`.
 */
export class UbiMap<
  K extends (string | number)[],
  V extends string | number = string,
  const S extends string = ' '
> {
  /** @internal map for storing keys mapped to values. */
  private readonly kmap = new Map<Join<K, S>, V>();

  /** @internal map for storing values mapped to keys. */
  private readonly vmap = new Map<V, Join<K, S>>();

  /** Creates a new instance of `UbiMap`. */
  constructor(
    /**
     * An optional initial dataset for the map, where keys are joined strings and values
     * are of type `V`.
     */
    data?: Record<Join<K, S>, V>,

    /**
     * The string used to separate components of compound keys.
     *
     * @default ' '
     */
    readonly separator: S = ' ' as S
  ) {
    if (data) {
      for (const [key, value] of Object.entries<V>(data)) {
        this.set(key as Join<K, S>, value);
      }
    }
  }

  /**
   * Adds a new key-value pair to the map. Both keys and values must be unique.
   *
   * @example
   *
   * ```ts
   * const ubimap = new UbiMap<[string, string]>();
   *
   * // Keys as separate arguments
   * ubimap.set('key1', 'key2', 'value');
   *
   * // Key in a single string
   * ubimap.set('key1 key2', 'value');
   * ```
   *
   * @param input - A tuple containing the components of the key followed by the value.
   * @throws Either {@linkcode KeyAlreadyExistsError} or {@linkcode ValueAlreadyExistsError}
   */
  set(...input: [...keys: K | [Join<K, S>], value: V]): void {
    const value = input.pop() as V;
    const key = input.join(this.separator) as Join<K, S>;

    if (this.kmap.has(key)) {
      throw new KeyAlreadyExistsError(key);
    }

    if (this.vmap.has(value)) {
      throw new ValueAlreadyExistsError(value);
    }

    this.kmap.set(key, value);
    this.vmap.set(value, key);
  }

  /**
   * Removes a key-value pair from the map.
   *
   * This method uses `delete` under the hood since this map was designed be a fast access
   * map and not a volatile one.
   *
   * @param keys - The components of the compound key.
   * @returns A boolean indicating whether the key was removed.
   */
  remove(...keys: K | [Join<K, S>]): boolean {
    const key = keys.join(this.separator) as Join<K, S>;
    const value = this.kmap.get(key);

    if (!value) {
      return false;
    }

    return this.kmap.delete(key) && this.vmap.delete(value);
  }

  /**
   * Checks if a key exists in the map.
   *
   * @param keys - The components of the compound key.
   * @returns A boolean indicating whether the key exists.
   * @see {@linkcode throwOnNotFound}
   */
  has(...keys: K | [Join<K, S>]): boolean {
    return this.kmap.has(keys.join(this.separator) as Join<K, S>);
  }

  /**
   * Retrieves the value associated with a compound key.
   *
   * ```ts
   * const ubimap = new UbiMap<[string, string]>();
   *
   * // Keys as separate arguments
   * ubimap.get('key1', 'key2');
   *
   * // Key in a single string
   * ubimap.set('key1 key2');
   * ```
   *
   * @param keys - The components of the compound key.
   * @returns The value associated with the key.
   * @throws An error if the key could not be found.
   */
  get(...keys: K | [Join<K, S>]): V {
    const key = keys.join(this.separator) as Join<K, S>;
    const value = this.kmap.get(key)!;

    if (value === undefined) {
      const error = new Error(`Key '${key}' not found.`);
      Object.assign(error, { key });
      throw error;
    }

    return value;
  }

  /**
   * Retrieves the compound key associated with a value.
   *
   * This method does not respects the `throwOnNotFound` property.
   *
   * @example
   *
   * ```ts
   * const ubimap = new UbiMap<[string, string]>();
   *
   * ubimap.set('a', 'b', 'value');
   *
   * console.log(ubimap.getKey('value')); // 'a b'
   * console.log(ubimap.getKey('not value')); // undefined
   * ```
   *
   * @param value - The value to look up.
   * @returns The joined key corresponding to the value, or `undefined` if the value does
   *   not exist.
   */
  getKey(value: V): Join<K, S> | undefined {
    return this.vmap.get(value);
  }

  /**
   * Lists all keys in the map that start with the specified prefixes.
   *
   * @example
   *
   * ```ts
   * const ubimap = new UbiMap<[string, string]>();
   *
   * ubimap.set('a', 'b', 'value1');
   * ubimap.set('a', 'c', 'value2');
   * ubimap.set('b', 'c', 'value3');
   *
   * console.log(ubimap.keys('a b')); // ['a b']
   * console.log(ubimap.keys('a', 'b')); // ['a b']
   * console.log(ubimap.keys('a')); // ['a b', 'a c']
   * console.log(ubimap.keys()); // ['a b', 'a c', 'b c']
   * ```
   *
   * @param prefixes - A partial tuple representing the key prefix to filter by.
   * @returns An array of keys matching the prefix.
   */
  keys(...prefixes: PartialTuple<K> | [Join<PartialTuple<K>, S>]): Join<K, S>[] {
    const prefix = prefixes.join(this.separator);
    const result: string[] = [];

    for (const key of this.kmap.keys()) {
      if (key.startsWith(prefix)) {
        result.push(key);
      }
    }

    return result as Join<K, S>[];
  }

  /**
   * Lists all values in the map whose associated keys start with the specified prefixes.
   *
   * @example
   *
   * ```ts
   * const ubimap = new UbiMap<[string, string]>();
   *
   * ubimap.set('a', 'b', 'value1');
   * ubimap.set('a', 'c', 'value2');
   * ubimap.set('b', 'c', 'value3');
   *
   * console.log(ubimap.values('a b')); // ['value1']
   * console.log(ubimap.values('a', 'b')); // ['value1']
   * console.log(ubimap.values('a')); // ['value1', 'value2']
   * console.log(ubimap.values()); // ['value1', 'value2', 'value3']
   * ```
   *
   * @param prefixes - A partial tuple representing the key prefix to filter by.
   * @returns An array of values corresponding to the matching keys.
   */
  values(...prefixes: PartialTuple<K> | [Join<PartialTuple<K>, S>]): V[] {
    const prefix = prefixes.join(this.separator);
    const result: V[] = [];

    for (const [key, value] of this.kmap.entries()) {
      if (key.startsWith(prefix)) {
        result.push(value);
      }
    }

    return result;
  }

  /**
   * Returns an array of key-value pairs whose keys start with the specified prefixes.
   *
   * @example
   *
   * ```ts
   * const ubimap = new UbiMap<[string, string]>();
   *
   * ubimap.set('a', 'b', 'value1');
   * ubimap.set('a', 'c', 'value2');
   * ubimap.set('b', 'c', 'value3');
   *
   * console.log(ubimap.filter('a b')); // [['a b', 'value1']]
   * console.log(ubimap.filter('a', 'b')); // [['a b', 'value1']]
   * console.log(ubimap.filter('a')); // [['a b', 'value1'], ['a c', 'value2']]
   * console.log(ubimap.filter()); // [['a b', 'value1'], ['a c', 'value2'], ['b c', 'value3']]
   * console.log(ubimap.filter(['a', 'b'])); // [['a b', 'value1']]
   * ```
   */
  filter(...prefixes: PartialTuple<K> | [Join<PartialTuple<K>, S>]): [...K, V][] {
    const prefix = prefixes.join(this.separator);
    const result: [...K, V][] = [];

    for (const [key, value] of this.kmap.entries()) {
      if (!key.startsWith(prefix)) {
        continue;
      }

      const keys = key.split(this.separator) as [...K, V];
      keys.push(value);
      result.push(keys);
    }

    return result;
  }

  /** @returns The number of key-value pairs in the map. */
  size(): number {
    return this.kmap.size;
  }

  /** Iterates over all key-value pairs in the map. */
  *[Symbol.iterator]() {
    for (const [key, value] of this.kmap.entries()) {
      yield [...(key.split(this.separator) as [...K, V]), value] as const;
    }
  }
}
