/** @jest-environment node */

import Axios from 'axios';
import { CacheRequestConfig, setupCache } from 'axios-cache-interceptor';
import { createAxiosCacheHooks } from '../src';

export const axios = setupCache(
  Axios.create({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    adapter: require('axios/lib/adapters/http')
  })
);

export function simpleQuery(name: string, extra?: CacheRequestConfig) {
  return axios.get<string>(`http://localhost:39874/${name}`, extra);
}

export function simpleMutation(name: string, extra?: CacheRequestConfig) {
  return axios.get<string>(`http://localhost:39874/${name}`, extra);
}

export const { useQuery, useMutation } = createAxiosCacheHooks(
  (args) => (args.push({}), args.length - 1)
);
