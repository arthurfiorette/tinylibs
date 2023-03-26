import { consume } from './consume';
import type { Commands, KeysOf, TemplateData } from './types';

export function t<D extends TemplateData, P extends KeysOf<D>[]>(
  _template: TemplateStringsArray,
  data: D,
  ...keys: Commands<P[number]>[]
) {
  const template = Array.from(_template);

  // This removes the first item from the template array,
  // allowing us have matching values for the same index at parameters and template
  {
    const prefix = template.shift();

    // If theres text before the data.
    if (prefix?.trim().length) {
      throw new Error(`Cannot have text before data "${prefix}"`);
    }
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
