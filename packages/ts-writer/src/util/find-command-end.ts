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

/**
 * Returns the amount of keys that are part of a command
 *
 * @param keys Keys must start with the cmd
 * @returns 1, if the command is `each` and the next key is `/each`
 */
export function findElseClause<
  Arg extends string = string,
  T extends TemplateData = TemplateData
>(keys: Commands<Arg, T>[]) {
  for (let index = 0, deep = 0; index < keys.length; index++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const key = keys[index]!;

    // Skips simple keys
    if (!key || typeof key === 'string') {
      continue;
    }

    switch (key[0]) {
      case 'if':
        deep++;
        break;
      case 'else':
        // Found the end of the command
        if (deep === 1) {
          return index;
        }
        break;
      case '/if':
        deep--;
        break;
    }
  }

  return undefined;
}
