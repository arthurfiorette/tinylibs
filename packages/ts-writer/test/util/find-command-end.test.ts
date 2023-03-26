import { findCommandEnd } from '../../src';

describe(findCommandEnd, () => {
  it('works normally', () => {
    expect(findCommandEnd('each', [['each', 'a'], 'a', 'b', 'c', ['/each']])).toBe(4);
    expect(findCommandEnd('each', [['each', 'a'], 'c', ['/each']])).toBe(2);
    expect(findCommandEnd('each', [['each', 'a'], 'b', ['/each'], 'c'])).toBe(2);
  });

  it('works with nested commands', () => {
    expect(
      findCommandEnd('each', [
        ['each', 'a'],
        'a',
        ['each', 'a'],
        'b',
        'c',
        'd',
        ['/each'],
        'e',
        'f',
        ['/each']
      ])
    ).toBe(9);
  });

  it('throws on non-closed commands', () => {
    expect(() => findCommandEnd('each', [['each', 'a'], 'a', 'b', 'c'])).toThrowError(
      'Command "each" is not closed.'
    );
    expect(() =>
      findCommandEnd('each', [
        ['each', 'a'],
        'a',
        ['each', 'a'],
        'b',
        'c',
        'd',
        ['/each'],
        'e',
        'f'
      ])
    ).toThrowError('Command "each" is not closed.');
  });
});
