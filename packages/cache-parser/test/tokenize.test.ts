/* eslint-disable @typescript-eslint/ban-ts-comment */

import { tokenize } from '../src/tokenize';

describe('tokenize() tests', () => {
  it('test unknown inputs', () => {
    expect(tokenize()).toHaveLength(0);
    //@ts-expect-error
    expect(tokenize(1)).toHaveLength(0);
    //@ts-expect-error
    expect(tokenize('a')).toHaveLength(0);
    //@ts-expect-error
    expect(tokenize(null)).toHaveLength(0);
    expect(tokenize(void 0)).toHaveLength(0);
    //@ts-expect-error
    expect(tokenize(() => 0)).toHaveLength(0);
    expect(tokenize(undefined)).toHaveLength(0);

    expect(
      tokenize({
        //@ts-expect-error
        maxAge: Function,
        //@ts-expect-error
        sMaxAge: new Date(),
        //@ts-expect-error
        staleIfError: true,
        //@ts-expect-error
        staleWhileRevalidate: 'asd'
      })
    ).toHaveLength(0);
  });

  it('tests with boolean values', () => {
    const immutable = tokenize({ immutable: true });
    expect(immutable).toHaveLength(1);
    expect(immutable).toContain('immutable');

    //@ts-expect-error
    const noStore = tokenize({ noStore: false });
    expect(noStore).toHaveLength(0);
  });

  it('tests with number values', () => {
    const positive = tokenize({ maxAge: 1 });
    expect(positive).toHaveLength(1);
    expect(positive).toContain('max-age=1');

    const zero = tokenize({ maxAge: 0 });
    expect(zero).toHaveLength(1);
    expect(zero).toContain('max-age=0');

    const negative = tokenize({ sMaxAge: -123 });
    expect(negative).toHaveLength(0);

    const infinity = tokenize({ sMaxAge: Infinity });
    expect(infinity).toHaveLength(0);
  });

  it('tests with multiple values', () => {
    const test1 = tokenize({
      maxAge: 1,
      immutable: true,
      //@ts-expect-error
      noStore: false
    });
    expect(test1).toHaveLength(2);
    expect(test1).toContain('max-age=1');
    expect(test1).toContain('immutable');

    const test2 = tokenize({
      maxAge: 1,
      immutable: true,
      //@ts-expect-error
      noStore: false,
      sMaxAge: -123
    });
    expect(test2).toHaveLength(2);
    expect(test2).toContain('max-age=1');
    expect(test2).toContain('immutable');

    const test3 = tokenize({
      maxAge: 1,
      immutable: true,
      //@ts-expect-error
      noStore: false,
      sMaxAge: Infinity
    });
    expect(test3).toHaveLength(2);
    expect(test3).toContain('max-age=1');
    expect(test3).toContain('immutable');

    const test4 = tokenize({
      staleWhileRevalidate: 1,
      staleIfError: 2,
      immutable: true,
      //@ts-expect-error
      noStore: false,
      sMaxAge: Infinity
    });
    expect(test4).toHaveLength(3);
    expect(test4).toContain('stale-while-revalidate=1');
    expect(test4).toContain('stale-if-error=2');
    expect(test4).toContain('immutable');
  });

  it('tests alphabetical order', () => {
    const tokens = tokenize({
      minFresh: 1,
      noStore: true,
      mustRevalidate: true,
      maxAge: 1,
      noTransform: true,
      proxyRevalidate: true,
      sMaxAge: 1,
      maxStale: 1,
      onlyIfCached: true,
      public: true,
      noCache: true,
      immutable: true,
      private: true,
      staleIfError: 1,
      staleWhileRevalidate: 1,
      mustUnderstand: true
    });

    expect(tokens).toBe(tokens.sort());

    expect(tokens.join(', ')).toEqual(
      'immutable, max-age=1, max-stale=1,' +
        ' min-fresh=1, must-revalidate, must-understand,' +
        ' no-cache, no-store, no-transform,' +
        ' only-if-cached, private, proxy-revalidate,' +
        ' public, s-maxage=1, stale-if-error=1,' +
        ' stale-while-revalidate=1'
    );
  });
});
