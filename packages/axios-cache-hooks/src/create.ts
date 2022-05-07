import { useEffect, useState } from 'react';
import { executeApiCall } from './api-call';
import {
  AxiosCacheHooksOptions,
  defaultConfigIndexFinder,
  defaultHashGenerator
} from './options';
import type { ApiCall, AxiosCacheHooks, DataLessState, State } from './types';
import { applyAbortController } from './update-config';

export function createAxiosCacheHooks(
  hookOptions: Partial<AxiosCacheHooksOptions>
): AxiosCacheHooks {
  const options = hookOptions as AxiosCacheHooksOptions;
  options.configIndexFinder ??= defaultConfigIndexFinder;
  options.hashGenerator ??= defaultHashGenerator;

  return {
    useQuery<D, A extends unknown[]>(apiCall: ApiCall<D, A>, ...args: A) {
      const internalState = useState<State<D>>({ loading: true });

      // Always create a new abort controller.
      // If the request is cached, the abort wont be used.
      const source = new AbortController();
      useEffect(() => () => source.abort(), []);

      applyAbortController(apiCall, options, args, source);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      executeApiCall(apiCall, args, internalState, options);

      return [internalState[0].data, internalState[0] as DataLessState<D>];
    },

    useMutation<D, A extends unknown[]>(apiCall: ApiCall<D, A>) {
      const internalState = useState<State<D>>({ loading: true });

      // Always create a new abort controller.
      // If the request is cached, the abort wont be used.
      const source = new AbortController();
      useEffect(() => () => source.abort(), []);

      return [
        internalState[0],
        (...args: A) => {
          applyAbortController(apiCall, options, args, source);
          return executeApiCall(apiCall, args, internalState, options);
        }
      ];
    }
  };
}
