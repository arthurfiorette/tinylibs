/* eslint-disable @typescript-eslint/no-floating-promises */
import { deferred } from '../src';

describe('tests promise compatibility', () => {
  it('test resolve method', () => {
    const d = deferred();

    expect(d).resolves.toBe(1);

    d.resolve(1);

    expect.assertions(1);
  });

  it('test bound resolve method', async () => {
    const d = deferred();

    setImmediate(
      d.resolve.bind(
        //@ts-expect-error - Testing with invalid promise
        { notAPromise: true }
      ),
      1
    );

    await expect(d).resolves.toBe(1);

    expect.assertions(1);
  });

  it('test bound reject method', async () => {
    const d = deferred();

    setImmediate(
      d.reject.bind(
        //@ts-expect-error - Testing with invalid promise
        { notAPromise: true }
      ),
      2
    );

    await expect(d).rejects.toBe(2);

    expect.assertions(1);
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

    expect.assertions(1);
  });

  it('test with try catch', () => {
    const d = deferred();

    process.nextTick(d.resolve, 1);

    expect(async () => await d).not.toThrow();

    expect.assertions(1);
  });
});
