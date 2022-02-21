/* eslint-disable @typescript-eslint/no-explicit-any */
const symbolKey = Symbol('fast-defer');

/**
 * A simple promise that can be resolved (or rejected) later
 *
 * **Note**: This does not polyfills the promise object.
 */
export interface Deferred<T = any> extends Promise<T> {
  /**
   * Resolve the promise with the given value
   *
   * @param value The value to resolve the promise with
   */
  resolve: (value: T | PromiseLike<T> | Promise<T>) => void;

  /**
   * Reject the promise with the given reason
   *
   * @param reason The value to reject the promise with
   */
  reject: (reason?: any) => void;
}

/** @returns A new {@link Deferred} object */
export function deferred<T>() {
  let resolve!: Deferred<T>['resolve'];
  let reject!: Deferred<T>['reject'];

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  }) as Deferred<T>;

  promise.resolve = resolve;
  promise.reject = reject;

  //@ts-expect-error don't expose this
  promise[symbolKey] = 1;

  return promise;
}

/**
 * Detects if the given parameter (being a promise or not) is a {@link Deferred}
 *
 * @param {any} value The promise to validate
 * @returns True if the given promise is a deferred, false otherwise
 */
export function isDeferred(value?: any): value is Deferred {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!(value && value[symbolKey]);
}
