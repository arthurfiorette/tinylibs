/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-for-in-array */

export function isDuration(val: unknown): boolean {
  return (
    (typeof val === 'string' || typeof val === 'number') &&
    (val = Number(val)) >= 0 &&
    (val as number) < Infinity
  );
}

export function isTruthy(val: unknown): boolean {
  return (
    val === true ||
    typeof val === 'number' ||
    (typeof val === 'string' && val !== 'false')
  );
}

export function parseRawHeaders(headerStr: string): Record<string, string | true> {
  const headers: Record<string, string | true> = {};

  const tokens = headerStr.toLowerCase().replace(/\s+/g, '').split(',');

  for (const key in tokens) {
    const token = tokens[key]!.split('=', 2);
    headers[token[0]!] = token[1] ?? true;
  }

  return headers;
}
