import { deferred, isDeferred } from '../src';

describe('isDeferred() tests', () => {
  it('still is a promise', () => {
    expect(typeof deferred).toBe('function');
    expect(deferred()).toBeInstanceOf(Promise);
  });

  it('tests isDeferred', () => {
    expect(isDeferred(deferred())).toBe(true);

    expect(isDeferred()).toBe(false);

    const notDeferred = [
      undefined,
      null,
      '',
      0,
      void 0,
      Promise.resolve(1),
      new Promise(() => void 0),
      () => 0,
      () => void 0,
      function () {
        return 123;
      },
      ':)',
      {
        // fake deferred
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...new Promise(() => void 0),
        resolve: () => void 0,
        reject: () => void 0
      }
    ];

    for (const value of notDeferred) {
      expect(isDeferred(value)).toBe(false);
    }
  });
});
