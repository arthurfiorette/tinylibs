import { act, renderHook } from '@testing-library/react-hooks';
import type { CacheRequestConfig } from 'axios-cache-interceptor';
import { simpleMutation, useMutation } from './api';

describe('Tests useMutation hook', () => {
  it('Tests normal usage', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMutation(simpleMutation));

    const [{ data, loading, error }, refetch] = result.current;
    expect(data).toBe(undefined);
    expect(loading).toBe(true);
    expect(error).toBeUndefined();

    await act(async () => {
      refetch('A');

      await waitForNextUpdate();

      {
        const [{ data, loading, error }] = result.current;
        expect(data).toStrictEqual({ name: 'A' });
        expect(loading).toBe(false);
        expect(error).toBeUndefined();
      }
    });
  });

  it('Tests no changes without calling refetch', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMutation(simpleMutation));

    {
      const [{ data, loading, error }] = result.current;
      expect(data).toBe(undefined);
      expect(loading).toBe(true);
      expect(error).toBeUndefined();
    }

    // Should never call any setState
    await expect(waitForNextUpdate()).rejects.toThrow(
      'Timed out in waitForNextUpdate after 1000ms.'
    );
  });

  it('Tests aborting useMutation request', async () => {
    const abort = new AbortController();

    const { result, waitForNextUpdate } = renderHook(() =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useMutation(async (name: string, _ignore?: CacheRequestConfig) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return simpleMutation(name, { signal: abort.signal });
      })
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
});
