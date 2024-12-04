/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { deferred } from '../src';

describe('tests deferred', () => {
  it('returns a new instance every time', () => {
    expect(deferred()).not.toEqual(deferred());
  });

  it('needs a Promise polyfill', () => {
    const old = Promise;
    //@ts-expect-error ignore
    // biome-ignore lint/suspicious/noGlobalAssign: <explanation>
    Promise = null;

    expect(() => deferred()).toThrowError('Promise is not a constructor');

    // biome-ignore lint/suspicious/noGlobalAssign: <explanation>
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

    expect.assertions(4);
  });
});
