import { act, renderHook } from '@testing-library/react-hooks';
import Axios, { AxiosError } from 'axios';
import type { CacheRequestConfig } from 'axios-cache-interceptor';
import { error404Query, simpleQuery, useQuery } from './api';

describe('Tests useQuery hook', () => {
  it('Tests normal usage', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useQuery(simpleQuery, 'A'));

    const [data, { loading, error }] = result.current;
    expect(data).toBe(undefined);
    expect(loading).toBe(true);
    expect(error).toBeUndefined();

    await act(async () => {
      await waitForNextUpdate();

      const [data, { loading, error }] = result.current;
      expect(error).toBeUndefined();
      expect(data).toStrictEqual({ name: 'A' });
      expect(loading).toBe(false);
    });
  });

  it('Tests changing the property', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook((a?: string) =>
      useQuery(simpleQuery, a || 'Default')
    );

    await act(async () => {
      await waitForNextUpdate();

      let firstRid;

      {
        const [data, { loading, error, response, rid }] = result.current;
        expect(data).toStrictEqual({ name: 'Default' });
        expect(loading).toBe(false);
        expect(error).toBeUndefined();

        firstRid = rid;

        expect(response?.cached).toBe(false);
      }

      rerender('Custom Value');

      {
        // Still be the same
        const [data, { loading, error, response, rid }] = result.current;
        expect(data).toStrictEqual({ name: 'Default' });
        expect(loading).toBe(false);
        expect(error).toBeUndefined();
        // Did not re-rendered from previous check
        expect(response?.cached).toBe(false);

        // Same response
        expect(rid).toBe(firstRid);
      }

      await waitForNextUpdate();

      {
        // Still be the same
        const [data, { loading, error, response, rid }] = result.current;
        expect(data).toStrictEqual({ name: 'Custom Value' });
        expect(loading).toBe(false);
        expect(error).toBeUndefined();
        expect(response?.cached).toBe(false);

        // Different Response
        expect(rid).not.toBe(firstRid);
      }
    });
  });

  it('A force abort should not update', async () => {
    const abort = new AbortController();

    const { result, waitForNextUpdate } = renderHook(() =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useQuery(async (name: string, _ignore?: CacheRequestConfig) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return simpleQuery(name, { signal: abort.signal });
      }, 'Default')
    );

    await act(async () => {
      result.current;
      abort.abort();
      result.current;

      // Aborting a request should never render a new update
      await expect(waitForNextUpdate()).rejects.toThrow(
        'Timed out in waitForNextUpdate after 1000ms.'
      );
    });
  });

  it('Tests receiving an 404 error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useQuery(error404Query));

    const [data, { loading, error }] = result.current;

    expect(error).toBeUndefined();
    expect(data).toBe(undefined);
    expect(loading).toBe(true);

    await act(async () => {
      await waitForNextUpdate();

      const [data, { loading, error, rid }] = result.current;
      expect(error).toBeDefined();
      expect(data).toBeUndefined();
      expect(loading).toBe(false);
      expect(rid).toBeDefined();

      expect(Axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).message).toBe('Request failed with status code 404');
    });
  }, 100000);
});
