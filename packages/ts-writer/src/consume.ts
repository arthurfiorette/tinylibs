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
    // console.log(result);
    // Has code to append
    if (result.code !== undefined) {
      code += result.code;
    }

    // Reached the end of the sub template
    if (!result.nextIndex) {
      break;
    }

    // Jumps to the next index
    index = result.nextIndex;
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
  let template = templates[index];

  // index out of bounds
  if (template === undefined) {
    return {};
  }

  const key = keys[index];

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

  // The ending of a command template, like /if
  if (key[0][0] === '/') {
    // The end command template, if needed, should've been appended on the previous iteration
    return {
      code: template,
      nextIndex: index + 1
    };
  }

  // Handles the 'each' command
  if (key[0] === 'each') {
    const argument = key[1];
    const array: unknown = indexObject(argument, data);

    if (!Array.isArray(array)) {
      throw new Error(`Key "${argument}" is not an array`);
    }

    const eachEndIndex = index + findCommandEnd('each', keys.slice(index));

    for (let arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
      const replacedKeys = replaceArrayIndexes(keys, argument, arrayIndex);

      template += consume(index + 1, eachEndIndex, templates, data, replacedKeys);
    }

    return {
      code: template,
      nextIndex: eachEndIndex + 1
    };
  }

  // Handles the 'if' command
  if (key[0] === 'if') {
    const argument = key[1];
    const condition = !!indexObject(argument, data);
    const ifEndIndex = index + findCommandEnd('if', keys.slice(index));

    if (condition) {
      // Appends the if body, if the condition is true
      template += consume(index + 1, ifEndIndex, templates, data, keys);
    }

    return {
      nextIndex: ifEndIndex + 1,
      code: template
    };
  }

  // Just throws an error if the command is invalid
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  throw new Error(`Invalid command: ${stringify(key)!}`);
}
