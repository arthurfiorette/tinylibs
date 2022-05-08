export type Options<T> = {
  /**
   * The maximum integer that `limit` should accept.
   *
   * @implNote This only works if `class-validator` is installed.
   */
  takeLimit: number;

  /**
   * If `distinct` should be included
   *
   * @default true
   */

  allowDistinct: boolean;
  /**
   * If `orderBy` should be included
   *
   * @default true
   */
  allowOrderBy: boolean;

  /**
   * If `cursor` should be included.
   *
   * **Enable this option by defining all unique fields that should be used.**
   */
  cursor?: (keyof T)[];
};

export const DefaultOptions: Options<unknown> = Object.freeze({
  takeLimit: 50,
  allowDistinct: true,
  allowOrderBy: true,
  cursor: []
});
