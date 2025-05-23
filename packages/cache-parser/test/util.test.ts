/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isDuration, isTruthy } from '../src/util';

describe('utils tests', () => {
  it('tests isDuration function', () => {
    expect(isDuration('1')).toBe(true);
    expect(isDuration(1)).toBe(true);

    expect(isDuration('A')).toBe(false);
    expect(isDuration({})).toBe(false);
    expect(isDuration(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isDuration(-1)).toBe(false);
    expect(isDuration(true)).toBe(false);
    expect(isDuration(false)).toBe(false);
    expect(isDuration(Symbol(''))).toBe(false);
    //@ts-expect-error
    expect(isDuration()).toBe(false);
    expect(isDuration(void 0)).toBe(false);
    expect(isDuration(null)).toBe(false);
    expect(isDuration(undefined)).toBe(false);
  });

  it('tests isTruthy function', () => {
    expect(isTruthy('1')).toBe(true);
    expect(isTruthy(1)).toBe(true);
    expect(isTruthy('A')).toBe(true);
    expect(isTruthy(-1)).toBe(true);
    expect(isTruthy(Number.POSITIVE_INFINITY)).toBe(true);
    expect(isTruthy(true)).toBe(true);

    expect(isTruthy({})).toBe(false);
    expect(isTruthy(Symbol(''))).toBe(false);
    //@ts-expect-error
    expect(isTruthy()).toBe(false);
    expect(isTruthy(false)).toBe(false);
    expect(isTruthy(void 0)).toBe(false);
    expect(isTruthy(null)).toBe(false);
    expect(isTruthy(undefined)).toBe(false);
  });
});
