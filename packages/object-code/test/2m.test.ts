import { hash } from '../src';

it('hashes a 2M object normally', () => {
  const example = {} as Record<string, { name: string; id: number }>;

  for (let i = 0; i < 2_000_000; i++) {
    example[i] = { name: 'test', id: i };
  }

  expect(typeof hash({ b: { example } })).toBe('number');
});
