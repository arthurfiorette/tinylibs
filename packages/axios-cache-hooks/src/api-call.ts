/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Axios from 'axios';
import { hash } from 'object-code';
import type { SetStateAction } from 'react';
import type { ApiCall, State } from './types';

export function executeApiCall<Data, Args extends unknown[]>(
  apiCall: ApiCall<Data, Args>,
  args: Args,
  setState: (value: SetStateAction<State<Data>>) => void,
  state: State<Data>
): Promise<void> {
  return (
    apiCall(...args)
      .then(
        // Successful response
        (response) => {
          // This is everything that is needed to determine
          // this response uniqueness.
          const rid = hash({
            h: response.headers,
            b: response.status,
            s: response.statusText
          });

          // Request never had data before or there is new data available
          if (state.loading || state.rid !== rid) {
            setState({
              loading: false,
              data: response.data,
              response,
              rid
            });
          }
        },

        // Error response
        (error) => {
          // Request was aborted because the component was unmounted
          // Updated the state now will throw the "Called SetState()
          // on an Unmounted Component" error.
          if (Axios.isCancel(error)) {
            return;
          }

          const rid = hash(error);

          if (rid !== state.rid) {
            setState({
              loading: false,
              error,
              rid
            });
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
