/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Axios from 'axios';
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
          const rid = options.hashGenerator(response, undefined);

          // Request never had data before or there is new data available
          if (state.rid !== rid) {
            setState({ loading: false, data: response.data, response, rid });
          }
        },

        // Error response
        (error) => {
          // Request was aborted because the component was unmounted
          // Update the state now will throw a "Called SetState()
          // on an Unmounted Component" error.
          if (Axios.isCancel(error)) {
            return;
          }

          const rid = options.hashGenerator(undefined, error);

          if (rid !== state.rid) {
            setState({ loading: false, error, rid });
          }
        }
      )
      // This avoids a unhandled promise exception in case of an unhandled
      // error thrown above.
      .catch((error) => {
        console.error('Unknown error thrown by axios cache hooks', error);
      })
  );
}
