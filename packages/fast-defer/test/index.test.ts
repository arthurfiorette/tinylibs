/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { deferred, isDeferred } from '../src';

describe('tests deferred', () => {
  it('test resolve method', () => {
    const d = deferred();

    expect(d).resolves.toBe(1);

    d.resolve(1);
  });

  it('test reject method', () => {
    const d = deferred();

    expect(d).rejects.toBe(1);

    d.reject(1);

    expect.assertions(1);
  });

  it('test then method', () => {
    const d = deferred();

    d.then((data) => {
      expect(data).toBe(1);
    });

    d.resolve(1);
    expect.assertions(1);
  });

  it('test catch method', () => {
    const d = deferred();

    d.catch((data) => {
      expect(data).toBe(1);
    });

    d.reject(1);
    expect.assertions(1);
  });

  it('test finally method', () => {
    const d = deferred<number>();
    let data: number;

    d.then((d) => {
      data = d;
    });

    d.finally(() => {
      expect(data).toBe(1);
    });

    d.resolve(1);
  });

  it('test with try catch', () => {
    const d = deferred();

    process.nextTick(d.resolve, 1);

    expect(async () => await d).not.toThrow();
  });

  it('tests isDeferred', () => {
    expect(isDeferred(deferred())).toBe(true);

    expect(isDeferred(Promise.resolve(1))).toBe(false);

    expect(isDeferred(1)).toBe(false);

    expect(isDeferred(null)).toBe(false);

    expect(isDeferred(undefined)).toBe(false);

    expect(isDeferred({})).toBe(false);

    expect(isDeferred(() => 0)).toBe(false);

    expect(isDeferred(':)')).toBe(false);

    expect(isDeferred(void 0)).toBe(false);

    expect(isDeferred()).toBe(false);

    const fakeDeferred = Promise.resolve();
    //@ts-expect-error ignore
    fakeDeferred.resolve = fakeDeferred.reject = () => void 0;

    expect(isDeferred(fakeDeferred)).toBe(false);
  });

  it('still is a promise', () => {
    const def = deferred();

    expect(def).toBeInstanceOf(Promise);
  });

  it('returns a new instance every time', () => {
    expect(deferred()).not.toEqual(deferred());
  });

  it('needs a Promise polyfill', () => {
    const old = Promise;
    //@ts-expect-error ignore
    Promise = null;

    expect(() => deferred()).toThrowError('Promise is not a constructor');

    Promise = old;
  });

  it('tests multiple deferred at the same time', () => {
    const def = deferred();
    const def1 = deferred();
    const def2 = deferred();
    const def3 = deferred();

    expect(def).resolves.toBe(1);
    expect(def1).resolves.toBe(2);
    expect(def2).rejects.toBe(3);
    expect(def3).rejects.toBe(4);

    def3.reject(4);
    def.resolve(1);
    def2.reject(3);
    def1.resolve(2);
  });
});
