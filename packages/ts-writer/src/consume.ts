import { stringify } from 'javascript-stringify';
import type { Commands, KeysOf, TemplateData } from './types';
import { findCommandEnd } from './util/find-command-end';
import { indexObject } from './util/index-object';
import { replaceArrayIndexes } from './util/replace-array-indexes';

/** Parses and evaluates a template string. */
export function consume<D extends TemplateData, P extends KeysOf<D>[]>(
  start: number,
  end: number,
  templates: string[],
  data: D,
  keys: Commands<P[number]>[]
): string {
  let code = '';
  let index = start;

  // Jumps on each nextIndex until it reaches the end of the template
  while (index <= end) {
    const result = consumeStep(templates, data, keys, index);

    // Has code to append
    if (result.code !== undefined) {
      code += result.code;
    }

    // Reached the end of the sub template
    if (!result.nextIndex) {
      break;
    }

    // Jumps to the next index
    index += result.nextIndex;
  }

  return code;
}

/** Parses and evaluates a single template and key of a template string. */
export function consumeStep<D extends TemplateData, P extends KeysOf<D>[]>(
  templates: string[],
  data: D,
  keys: Commands<P[number]>[],
  index: number
): {
  code?: string;
  nextIndex?: number;
} {
  const template = templates[index];
  const key = keys[index];

  // index out of bounds
  if (template === undefined) {
    return {};
  }

  // If there's no key, it means it's a simple template
  if (key === undefined) {
    return { code: template, nextIndex: index + 1 };
  }

  // If the parameter is a string, it means it's simply a data's key
  if (typeof key === 'string') {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      code: template + stringify(indexObject(key, data))!,
      nextIndex: index + 1
    };
  }

  if (key[0].startsWith('/')) {
    // The end command template, if needed, should've been appended on the previous iteration
    return {
      code: template,
      nextIndex: index + 1
    };
  }

  // If the parameter is an array, it means it's a special command
  switch (key[0]) {
    case 'each': {
      const argument = key[1];
      const array: unknown = indexObject(argument, data);

      if (!Array.isArray(array)) {
        throw new Error(`Key "${argument}" is not an array`);
      }

      const eachEndIndex = index + findCommandEnd('each', keys.slice(index));
      let bodyCode = '';

      for (let arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
        const replacedKeys = replaceArrayIndexes(keys, argument, arrayIndex);

        bodyCode +=
          consume(index + 1, eachEndIndex, templates, data, replacedKeys) +
          // Appends the [/each]s template tag on each iteration instead
          // of appending it once at the end
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          templates[eachEndIndex]!;
      }

      return {
        code: template + bodyCode,
        nextIndex: eachEndIndex + 1
      };
    }

    case 'if': {
      const argument = key[1];
      const condition = !!indexObject(argument, data);
      const ifEndIndex = index + findCommandEnd('each', keys.slice(index));

      // If the condition is true, parse the template
      if (!condition) {
        return {
          code: template,
          // Jumps to the [/if] tag to void ignoring its template
          nextIndex: ifEndIndex - 1
        };
      }

      return {
        code:
          // Starts with the template
          template +
          // Appends the if body
          consume(index + 1, ifEndIndex, templates, data, keys) +
          // Appends the [/if]s template tag only if the condition is true
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          templates[ifEndIndex]!,
        nextIndex: ifEndIndex + 1
      };
    }

    default:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      throw new Error(`Invalid command: ${stringify(key)!}`);
  }
}
