import { t } from '../src/t';

describe(t, () => {
  it('works with helpers', () => {
    const handler = jest.fn().mockReturnValue(1) as (arg?: string) => string;
    const helpers = [['test', handler]] as const;
    const data = { helpers, a: 1, b: { e: 1 } } as const;

    expect(t`${data}${['$test']}${['$test', 'a']}${['$test', 'b.e']}`).toBe('111');

    expect(handler).toBeCalledTimes(3);
    expect(handler).toBeCalledWith(undefined, data);
    expect(handler).toBeCalledWith('a', data);
    expect(handler).toBeCalledWith('b.e', data);
  });

  it('throws when no helper is found', () => {
    expect(
      //@ts-expect-error expected to break
      () => t`${{ helpers: [] as const, a: 1, b: { e: 1 } }}${['$test']}`
    ).toThrowError('Helper "test" not found');

    expect(
      //@ts-expect-error expected to break
      () => t`${{ a: 1, b: { e: 1 } }}${['$test']}`
    ).toThrowError('Helper "test" not found');
  });
});
