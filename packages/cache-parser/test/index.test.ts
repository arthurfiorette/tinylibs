import { isCacheControl, parse } from '../src';

describe('isCacheControl() tests', () => {
  it('test isCacheControl', () => {
    expect(isCacheControl(parse(''))).toBe(true);

    expect(isCacheControl()).toBe(false);
    expect(isCacheControl(1)).toBe(false);
    expect(isCacheControl({})).toBe(false);
    expect(isCacheControl('a')).toBe(false);
    expect(isCacheControl(null)).toBe(false);
    expect(isCacheControl(void 0)).toBe(false);
    expect(isCacheControl(() => 0)).toBe(false);
    expect(isCacheControl(undefined)).toBe(false);

    // Fake cache control
    expect(isCacheControl({ immutable: true })).toBe(false);
  });
});
