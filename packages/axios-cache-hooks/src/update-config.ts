/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ConfigIndexFinder } from './types';

export function applyAbortController(
  configParameterIndex: ConfigIndexFinder,
  args: unknown[],
  source: AbortController
) {
  const confIndex =
    typeof configParameterIndex === 'function'
      ? configParameterIndex(args)
      : configParameterIndex;

  args[confIndex] ??= {};

  // Overriding the axios signal opens space
  // to cancel the request if the component
  // is unmounted before the request is resolved.
  //@ts-expect-error ignore
  args[confIndex].signal = source.signal;
}
