import { stringify as javascriptStringify } from 'javascript-stringify';

export function stringify(value: unknown) {
  return typeof value === 'function' || typeof value === 'object'
    ? javascriptStringify(value)
    : String(value);
}
