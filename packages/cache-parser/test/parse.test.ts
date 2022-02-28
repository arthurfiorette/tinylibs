/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CacheControl, parse, tokenize } from '../src';

describe('parse() tests', () => {
  it('tests unknown arguments', () => {
    expect(parse()).toEqual({});

    //@ts-expect-error
    expect(parse(1)).toEqual({});

    //@ts-expect-error
    expect(parse({})).toEqual({});

    //@ts-expect-error
    expect(parse(Symbol())).toEqual({});

    //@ts-expect-error
    expect(parse(true)).toEqual({});

    expect(parse('α')).toEqual({});

    expect(parse('2/3r97+48')).toEqual({});
  });

  it('tests unknown values', () => {
    expect(parse('a')).toEqual({});
    expect(parse('a=1, b=asd, c=true, d')).toEqual({});
  });

  it('test booleans directives', () => {
    expect(parse('immutable')).toEqual({ immutable: true });
    expect(parse('immutable=true')).toEqual({ immutable: true });
    expect(parse('immutable=false')).toEqual({});

    expect(parse('no-cache, no-store=true, immutable=false')).toEqual({
      noCache: true,
      noStore: true
    });

    expect(parse('immutable=1, no-cache=1')).toEqual({ immutable: true, noCache: true });
  });

  it('tests value overlapping', () => {
    expect(parse('max-age=1')).toEqual({ maxAge: 1 });
    expect(parse('max-age=1, max-age=2')).toEqual({ maxAge: 2 });
    expect(parse('max-age=1, max-age=2, max-age=3')).toEqual({ maxAge: 3 });
  });

  it('tests normal usage', () => {
    expect(parse('max-age=1, immutable')).toEqual({
      maxAge: 1,
      immutable: true
    });

    expect(parse('max-age=1, immutable, no-cache')).toEqual({
      maxAge: 1,
      immutable: true,
      noCache: true
    });
  });

  it('tests all directives', () => {
    expect(
      parse(
        'immutable, max-age=1, max-stale=1,' +
          ' min-fresh=1, must-revalidate, must-understand,' +
          ' no-cache, no-store, no-transform,' +
          ' only-if-cached, private, proxy-revalidate,' +
          ' public, s-maxage=1, stale-if-error=1,' +
          ' stale-while-revalidate=1'
      )
    ).toEqual({
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
  });

  it('tests all directives wrongly', () => {
    expect(
      parse(
        'immutable=1, max-age, max-stale,' +
          ' min-fresh, must-revalidate=1, must-understand=1,' +
          ' no-cache=1, no-store=1, no-transform=1,' +
          ' only-if-cached=1, private=1, proxy-revalidate=1,' +
          ' public=1, s-maxage, stale-if-error,' +
          ' stale-while-revalidate'
      )
    ).toEqual({
      noStore: true,
      mustRevalidate: true,
      noTransform: true,
      proxyRevalidate: true,
      onlyIfCached: true,
      public: true,
      noCache: true,
      immutable: true,
      private: true,
      mustUnderstand: true
    });
  });

  it('tests the input preservation with', () => {
    const directivesObj: CacheControl = {
      mustRevalidate: true,
      noStore: true,
      noTransform: true,
      proxyRevalidate: true
    };

    const headerStr = tokenize(directivesObj).join(', ');

    expect(parse(headerStr)).toEqual(directivesObj);

    // Alphabetical order
    const directivesStr = 'must-revalidate, no-store, no-transform, proxy-revalidate';
    const headerObj = parse(directivesStr);
    expect(tokenize(headerObj).join(', ')).toEqual(directivesStr);
  });
});
