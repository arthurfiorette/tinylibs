import { useEffect, useState } from 'react';
import { executeApiCall } from './api-call';
import type {
  ApiCall,
  AxiosCacheHooks,
  ConfigIndexFinder,
  DataLessState,
  State
} from './types';
import { applyAbortController } from './update-config';

export function createAxiosCacheHooks(
  this: void,
  configParameterIndex: ConfigIndexFinder
): AxiosCacheHooks {
  return {
    useQuery<D, A extends unknown[]>(apiCall: ApiCall<D, A>, ...args: A) {
      const [state, setState] = useState<State<D>>({ loading: true });

      // Always create a new abort controller.
      // If the request is cached, the abort wont be used.
      const source = new AbortController();
      useEffect(() => () => source.abort(), []);

      applyAbortController(configParameterIndex, args, source);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      executeApiCall(apiCall, args, setState, state);

      return [
        state.data,
        state as DataLessState<D>,
        (...args: A) => {
          applyAbortController(configParameterIndex, args, source);
          return executeApiCall(apiCall, args, setState, state);
        }
      ];
    },

    useMutation<D, A extends unknown[]>(apiCall: ApiCall<D, A>) {
      const [state, setState] = useState<State<D>>({ loading: true });

      // Always create a new abort controller.
      // If the request is cached, the abort wont be used.
      const source = new AbortController();
      useEffect(() => () => source.abort(), []);

      return [
        state,
        (...args: A) => {
          applyAbortController(configParameterIndex, args, source);
          return executeApiCall(apiCall, args, setState, state);
        }
      ];
    }
  };
}
