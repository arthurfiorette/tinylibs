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
    typeof val === 'number' ||
    val === true ||
    (typeof val === 'string' && val !== 'false')
  );
}

export function parseHeadersString(headerStr: string): Record<string, string | true> {
  const tokens = headerStr.toLowerCase().replace(/\s+/g, '').split(',');
  const headers: Record<string, string | true> = {};

  for (const key in tokens) {
    const token = tokens[key]!.split('=', 2) as [string] | [string, string];
    headers[token[0]] = token.length === 1 ? true : token[1];
  }

  return headers;
}
