import type { Commands, KeysOf, TemplateData } from '../types';

export function replaceArrayIndexes<D extends TemplateData, P extends KeysOf<D>[]>(
  keys: Commands<P[number]>[],
  argument: string,
  index: number,
  symbol = '@'
): typeof keys {
  const startsWithArgumentDotSymbol = new RegExp(`^${argument}\\.${symbol}`);

  // Manually type the keys, otherwise your machine will grind to a halt
  // trying to infer the type :)
  return keys.map<Commands<P[number]>>((key) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let path = typeof key === 'string' ? key : key[1];

    // Commands like ['/if', '/each'] don't have a path
    if (!path) {
      return key;
    }

    // the symbols in each blocks are meant to be replaced by the index
    path = path.replace(startsWithArgumentDotSymbol, `${argument}.${index}`) as P[number];

    // Replaces the key with the new path
    if (typeof key === 'string') {
      key = path;
    } else {
      // Clones the key, so we don't mutate the original
      key = [key[0] as 'if', path];
    }

    return key;
  });
}
