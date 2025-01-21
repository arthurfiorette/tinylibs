/**
 * Constructs a string by joining the elements of a tuple of strings (`I`) with a
 * specified delimiter (`D`). If no delimiter is provided, it defaults to a single space
 * (' ').
 *
 * @example
 *
 * ```ts
 * type Result1 = Join<['a', 'b', 'c'], '-'>; // 'a-b-c'
 * type Result2 = Join<['hello', 'world']>; // 'hello world'
 * type Result3 = Join<[]>; // ''
 * ```
 *
 * @template I - A tuple of strings to join.
 * @template D - The delimiter string used to separate elements. Defaults to `' '`.
 */
export type Join<I extends (string | number)[], D extends string> = I extends [
  infer First extends string | number,
  ...infer Rest extends (string | number)[]
]
  ? `${First}${Rest extends [] ? '' : `${D}${Join<Rest, D>}`}`
  : '';

/**
 * Constructs a type representing all possible partial tuples derived from a tuple type
 * (`C`). Each partial tuple includes the elements of the original tuple in the same order
 * but may omit any tail elements.
 *
 * @example
 *
 * ```ts
 * type Result1 = PartialTuple<[1, 2, 3]>; // [] | [1] | [1, 2] | [1, 2, 3]
 * type Result2 = PartialTuple<['a', 'b']>; // [] | ['a'] | ['a', 'b']
 * type Result3 = PartialTuple<[]>; // []
 * ```
 *
 * @template C - The tuple type to generate partial tuples from.
 */
export type PartialTuple<C extends unknown[]> = C extends [infer First, ...infer Rest]
  ? [] | [First, ...PartialTuple<Rest>]
  : [];

/** Options for configuring a new `UbiMap` instance. */
export interface UbimapOptions<S extends string> {
  /**
   * The string used to separate components of compound keys.
   *
   * @default ' '
   */
  separator: S;

  /**
   * A boolean indicating whether to throw an error when a key is not found on a `get`
   * operation.
   *
   * @default false
   */
  throwOnNotFound: boolean;
}
