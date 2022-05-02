import { act, renderHook } from '@testing-library/react-hooks';
import { simpleQuery, useQuery } from './api';

describe('Runs simple query tests', () => {
  it('Tests normal usage', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useQuery(simpleQuery, 'A'));

    const [data, { loading, error }] = result.current;
    expect(data).toBe(undefined);
    expect(loading).toBe(true);
    expect(error).toBeUndefined();

    await act(async () => {
      await waitForNextUpdate();

      const [data, { loading, error }] = result.current;
      expect(data).toStrictEqual({ name: 'A' });
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
    });
  });

  it('Tests changing the property', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook((a?: string) =>
      useQuery(simpleQuery, a || 'Default')
    );

    {
      const [data, { loading, error, response, rid }] = result.current;
      expect(data).toBeUndefined();
      expect(error).toBeUndefined();
      expect(response).toBeUndefined();
      expect(rid).toBeUndefined();
      expect(loading).toBe(true);
    }

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
});
