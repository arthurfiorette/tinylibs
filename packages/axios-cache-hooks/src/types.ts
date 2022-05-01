/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CacheAxiosResponse } from 'axios-cache-interceptor';

export type State<T> =
  | {
      loading: true;
      data?: undefined;
      error?: undefined;
      response?: undefined;

      /**
       * Last response data unique id.
       *
       * @internal
       */
      rid?: number;
    }
  | {
      loading: false;
      data: T;
      error?: undefined;
      response: CacheAxiosResponse<T>;

      /**
       * Last response data unique id.
       *
       * @internal
       */
      rid: number;
    }
  | {
      loading: false;
      data?: undefined;
      error: unknown;
      response?: CacheAxiosResponse<unknown>;

      /**
       * Last response data unique id.
       *
       * @internal
       */
      rid: number;
    };

export type ApiCall<D, A extends any[]> = (...args: A) => Promise<CacheAxiosResponse<D>>;

export type ConfigIndexFinder = number | ((args: unknown[]) => number);
export type DataLessState<D> = Omit<State<D>, 'data' | 'achId'>;

export type AxiosCacheHooks = {
  useQuery<D, A extends unknown[]>(
    this: void,
    apiCall: ApiCall<D, A>,
    ...args: A
  ): [D | undefined, DataLessState<D>, (...args: A) => Promise<void>];

  useMutation<D, A extends unknown[]>(
    this: void,
    apiCall: ApiCall<D, A>
  ): [State<D>, (...args: A) => Promise<void>];
};
