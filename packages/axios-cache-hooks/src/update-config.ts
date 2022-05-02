/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ApiCall, ConfigIndexFinder } from './types';

export function applyAbortController<D, A extends unknown[]>(
  apiCall: ApiCall<D, A>,
  configParameterIndex: ConfigIndexFinder,
  args: A,
  source: AbortController
) {
  const confIndex = configParameterIndex(apiCall, ...args);

  args[confIndex] ??= {};

  // Overriding the axios signal opens space
  // to cancel the request if the component
  // is unmounted before the request is resolved.
  //@ts-expect-error ignore
  args[confIndex].signal = source.signal;
}
