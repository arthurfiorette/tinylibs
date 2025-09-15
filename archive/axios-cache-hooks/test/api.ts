import Axios from 'axios';
import {
  type CacheRequestConfig,
  buildMemoryStorage,
  setupCache
} from 'axios-cache-interceptor';
import { createAxiosCacheHooks } from '../src';

export const axios = setupCache(Axios.create({ adapter: 'http' }));

export async function simpleQuery(name: string, extra?: CacheRequestConfig) {
  return axios.get<string>(`http://localhost:39874/${name}`, extra);
}

export function error404Query(extra?: CacheRequestConfig) {
  return axios.get<unknown>('http://localhost:39874/', extra);
}

export function simpleMutation(name: string, extra?: CacheRequestConfig) {
  return axios.post<string>(`http://localhost:39874/${name}`, extra);
}

afterEach(() => {
  axios.storage = buildMemoryStorage();
});

export const { useQuery, useMutation } = createAxiosCacheHooks();
