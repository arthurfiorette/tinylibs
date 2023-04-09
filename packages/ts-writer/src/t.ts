import { consume } from './consume';
import type { Commands, KeysOf, TemplateData } from './types';

export enum T {
  Each = 'each',
  EndEach = '/each',
  If = 'if',
  EndIf = '/if'
}

/**
 * The generic template string template engine function, it does not have any special
 * features, it just fills the provided template with your data.
 *
 * @returns The generated string
 */
export function t<D extends TemplateData, P extends KeysOf<Omit<D, 'helpers'>>[]>(
  _template: TemplateStringsArray,
  data: D,
  ...keys: Commands<P[number], D>[]
): string {
  /** Copies array into mutable */
  const template = _template.slice();

  // This removes the first item from the template array,
  // allowing us have matching values for the same index at parameters and template
  {
    const prefix = (template as unknown as string[]).shift();

    // If theres text before the data.
    if (prefix?.trim().length) {
      throw new Error(`Cannot have text before data "${prefix}"`);
    }
  }

  // Trims the start of the code, if there's any
  if (template[0]) {
    template[0] = template[0].trimStart();
  }

  // Trims the end of the code, if there's any
  if (template[template.length - 1]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    template[template.length - 1] = template[template.length - 1]!.trimEnd();
  }

  // Runs consume with the whole template range
  return consume(
    //  template info
    0,
    template.length,
    template,
    // data object
    data,
    // keys array
    keys
  );
}
