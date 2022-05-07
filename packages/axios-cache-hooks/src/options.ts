/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CacheAxiosResponse } from 'axios-cache-interceptor';
import { hash } from 'object-code';

/**
 * All available options for the `axios-cache-hooks` package.
 *
 * @see https://tinylibs.js.org/packages/axios-cache-hooks
 */
export type AxiosCacheHooksOptions = {
  /**
   * A function that must return parameter index that accepts a `CacheRequestConfig` object.
   *
   * **Tip**: You can use `function.length` to find the number of available parameters.
   *
   * Default implementation returns the last function parameter.
   *
   * @default defaultConfigIndexFinder
   * @param {Function} fn The provided axios call function
   * @param {any[]} args All provided arguments to the function. Note, unprovided
   *   arguments won't be present in the array.
   * @see {@link defaultConfigIndexFinder}
   */
  configIndexFinder: ConfigIndexFinder;

  /**
   * A function that returns a unique id for a given response or error.
   *
   * Used to determine if a response is different than the previous one by comparing its
   * generated hash.
   *
   * Default implementation uses `object-code` library.
   *
   * **Note**: Returning undefined will ignore the given error or response.
   *
   * @default defaultHashGenerator
   * @param {CacheAxiosResponse} [response] The axios response, if present.
   * @param {any} [error] A thrown error, if any
   * @see {@link defaultHashGenerator}
   */
  hashGenerator: HashGenerator;
};

/**
 * A function that must return parameter index that accepts a `CacheRequestConfig` object.
 *
 * **Tip**: You can use `function.length` to find the number of available parameters.
 *
 * Default implementation returns the last function parameter.
 *
 * @default defaultConfigIndexFinder
 * @param {Function} fn The provided axios call function
 * @param {any[]} args All provided arguments to the function. Note, unprovided arguments
 *   won't be present in the array.
 * @see {@link defaultConfigIndexFinder}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ConfigIndexFinder = (fn: Function, ...args: any[]) => number;

/**
 * A function that returns a unique id for a given response or error.
 *
 * Used to determine if a response is different than the previous one by comparing its
 * generated hash.
 *
 * Default implementation uses `object-code` library.
 *
 * **Note**: Returning undefined will ignore the given error or response.
 *
 * @default defaultHashGenerator
 * @param {CacheAxiosResponse} [response] The axios response, if present.
 * @param {any} [error] A thrown error, if any
 * @see {@link defaultHashGenerator}
 */
export type HashGenerator = (response?: CacheAxiosResponse, error?: any) => number;

export const defaultConfigIndexFinder: ConfigIndexFinder = (fn) => {
  return fn.length - 1;
};

export const defaultHashGenerator: HashGenerator = (res, err) => {
  return res
    ? hash({ h: res.headers, s: res.status, t: res.statusText })
    : err
    ? // eslint-disable-next-line
      hash({ m: err.message, c: err.code, n: err.name, j: err.toJSON() })
    : 0;
};
