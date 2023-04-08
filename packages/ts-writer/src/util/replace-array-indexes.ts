import type { Commands, KeysOf, TemplateData } from '../types';

export function replaceArrayIndexes<D extends TemplateData, P extends KeysOf<D>[]>(
  keys: Commands<P[number]>[],
  argument: string,
  index: number,
  symbol = '@'
): typeof keys {
  const mappedKeys = Array<Commands<P[number]>>(keys.length);

  for (let i = 0; i < keys.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const key = keys[i]!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let path = typeof key === 'string' ? key : key[1]!;

    if (
      // Commands like ['/if', '/each'] don't have a path
      !path ||
      // Not a dotted path
      !path.startsWith(`${argument}.${symbol}`)
    ) {
      // Just copies the key
      mappedKeys[i] = key;
      continue;
    }

    // Replaces the key with the new path
    path = (`${argument}.${index}` +
      path.slice(argument.length + symbol.length + 1)) as typeof path;

    mappedKeys[i] =
      typeof key === 'string'
        ? path
        : // Clones the key, so we don't mutate the original
          [key[0] as 'if', path];
  }

  return mappedKeys;
}
