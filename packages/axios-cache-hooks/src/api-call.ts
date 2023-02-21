import type { Dispatch, SetStateAction } from 'react';
import type { AxiosCacheHooksOptions } from './options';
import type { ApiCall, State } from './types';

export function executeApiCall<Data, Args extends unknown[]>(
  apiCall: ApiCall<Data, Args>,
  args: Args,
  [state, setState]: [State<Data>, Dispatch<SetStateAction<State<Data>>>],
  options: AxiosCacheHooksOptions
): Promise<void> {
  return (
    apiCall(...args)
      .then(
        // Successful response
        (response) => {
          const requestId = options.hashGenerator(response, undefined);

          // Request never had data before or there is new data available
          if (state.rid !== requestId) {
            setState({ loading: false, data: response.data, response, rid: requestId });
          }
        },

        // Error response
        (error) => {
          // Request was aborted because the component was unmounted
          // Update the state now will throw a "Called SetState()
          // on an Unmounted Component" error.
          if (isAxiosCancel(error)) {
            return;
          }

          const requestId = options.hashGenerator(undefined, error);

          if (requestId !== state.rid) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            setState({ loading: false, error, rid: requestId });
          }
        }
      )
      // This avoids a unhandled promise exception in case of an unhandled
      // error thrown above.
      .catch((error) => {
        /* istanbul ignore next */
        console.error('Unknown error thrown by axios cache hooks', error);
      })
  );
}

/**
 * Copied from Axios source code to avoid importing the whole library.
 *
 * @see https://github.com/axios/axios/blob/master/lib/cancel/isCancel.js
 */
function isAxiosCancel(error: unknown): boolean {
  return !!(error && (error as Record<string, boolean>)['__CANCEL__']);
}
