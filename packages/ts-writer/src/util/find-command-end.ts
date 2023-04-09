import type { Commands, TemplateData } from '../types';

/**
 * Returns the amount of keys that are part of a command
 *
 * @param keys Keys must start with the cmd
 * @returns 1, if the command is `each` and the next key is `/each`
 */
export function findCommandEnd<
  Arg extends string = string,
  T extends TemplateData = TemplateData
>(command: string, keys: Commands<Arg, T>[]) {
  for (let index = 0, deep = 0; index < keys.length; index++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const key = keys[index]!;

    // Skips simple keys
    if (!key || typeof key === 'string') {
      continue;
    }

    switch (key[0]) {
      case command:
        deep++;
        break;
      case '/' + command:
        deep--;
        break;
    }

    // Found the end of the command
    if (deep === 0) {
      return index;
    }
  }

  throw new Error(`Command "${command}" is not closed.`);
}
