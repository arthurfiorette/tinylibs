import type { CacheAxiosResponse } from 'axios-cache-interceptor';

/** The internal axios state used by `axios-cache-hooks` */
export type State<T> = LoadingState | ErrorState | SuccessState<T>;

export type LoadingState = {
  /** If the current request is loading */
  loading: true;
  /** The returned data for this request, if present */
  data?: undefined;
  /** The error thrown by this http request, if any */
  error?: undefined;
  /** The complete `CacheAxiosResponse` */
  response?: undefined;
  /** Last response data unique id. @internal */
  rid?: number;
};

export type ErrorState = {
  /** If the current request is loading */
  loading: false;
  /** The returned data for this request, if present */
  data?: undefined;
  /** The error thrown by this http request, if any */
  error: unknown;
  /** The complete `CacheAxiosResponse` */
  response?: CacheAxiosResponse;
  /** Last response data unique id. @internal */
  rid: number;
};

export type SuccessState<D> = {
  /** If the request is loading */
  loading: false;
  /** The returned data for this request, if present */
  data: D;
  /** The error thrown by this http request, if any */
  error?: undefined;
  /** The complete `CacheAxiosResponse` */
  response: CacheAxiosResponse<D>;
  /** Last response data unique id. @internal */
  rid: number;
};

/**
 * This is where you should define your custom axios request logic.
 *
 * **Note**: Remember to ALWAYS spread the `CacheRequestConfig` object in the axios call.
 *
 * @example
 *
 * ```ts
 * const [data] = useQuery((arg1: string, config?: CacheRequestConfig) => {
 *   return api.get('/users/', { params: { arg1 }, ...config });
 * });
 * ```
 */
export type ApiCall<D, A extends unknown[]> = (
  ...args: A
) => Promise<CacheAxiosResponse<D>>;

/**
 * The current request state.
 *
 * The response data was provided as the in the first object of this tuple.
 */
export type DataLessState<D> = Omit<State<D>, 'data'>;

export type AxiosCacheHooks = {
  /**
   * Uses the provided `apiCall` to execute a axios request.
   *
   * Make sure the `apiCall` function has an `CacheRequestConfig` argument in the same
   * index as your `configIndexFinder` defined.
   *
   * **Note**: This is different from `useMutation` because it calls the axios request
   * directly on the first render.
   *
   * @example
   *
   * ```tsx
   * const [user, { loading }] = useQuery(getUser, 'Arthur');
   *
   * if (loading) {
   *   return <div>Loading...</div>;
   * }
   *
   * return <div>{user.name}</div>;
   * ```
   *
   * @param apiCall The function that will return a {@link CacheAxiosResponse}
   * @param args Arguments to pass to the `apiCall`. You can change this arguments without
   *   any problems.
   * @see http://tinylibs.js.org/packages/axios-cache-hooks
   */
  useQuery<D, A extends unknown[]>(
    this: void,
    apiCall: ApiCall<D, A>,
    ...args: A
  ): [data: D | undefined, info: DataLessState<D>];

  /**
   * Uses the provided `apiCall` to execute a axios request when the returned `refetch`
   * function is called.
   *
   * Make sure the `apiCall` function has an `CacheRequestConfig` argument in the same
   * index as your `configIndexFinder` defined.
   *
   * **Note**: This is different from `useQuery` because it **DOES NOT** calls the axios
   * request on the first render.
   *
   * @example
   *
   * ```tsx
   * const [state, refetch] = useMutation(createUser);
   *
   * return <button onClick={() => refetch('Arthur')}>Create profile!</button>;
   * ```
   *
   * @param apiCall The function that will return a {@link CacheAxiosResponse}.
   * @see http://tinylibs.js.org/packages/axios-cache-hooks
   */
  useMutation<D, A extends unknown[]>(
    this: void,
    apiCall: ApiCall<D, A>
  ): [state: State<D>, refetch: (...args: A) => void];
};
