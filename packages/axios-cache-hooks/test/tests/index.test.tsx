import { act, renderHook } from '@testing-library/react-hooks';
import { simpleQuery, useQuery } from '../api';

it('Tests', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useQuery(simpleQuery, 'AAA'));

  const [data] = result.current;
  expect(data).toBe(undefined);

  await act(async () => {
    await waitForNextUpdate();
    const [data, , refetch] = result.current;

    expect(data).toStrictEqual({ name: 'AAA' });

    await refetch('AAA');

    expect(data).toStrictEqual({ name: 'AAA' });
  });
});
