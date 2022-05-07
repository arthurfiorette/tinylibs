/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { AxiosCacheHooksOptions } from './options';
import type { ApiCall } from './types';

export function applyAbortController<D, A extends unknown[]>(
  apiCall: ApiCall<D, A>,
  options: AxiosCacheHooksOptions,
  args: A,
  abort: AbortController
) {
  const confIndex = options.configIndexFinder(apiCall, ...args);

  args[confIndex] ??= {};

  // Overriding the axios signal opens space
  // to cancel the request if the component
  // is unmounted before the request is resolved.
  //@ts-expect-error - Trust the found parameter index.
  args[confIndex].signal = abort.signal;
}
