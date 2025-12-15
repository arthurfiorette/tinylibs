export function sortNumbers(a: string, b: string) {
  return a > b ? 1 : -1;
}

export function sortPairsByKey(a: [unknown, unknown], b: [unknown, unknown]) {
  return sortNumbers(String(a[0]), String(b[0]));
}

export function keyToKeyValuePair(val: any, key: string): [unknown, unknown] {
  return [key, val[key]];
}

export function entriesToPairs(val: any): [unknown, unknown][] {
  return Array.from(val.entries()) as [unknown, unknown][];
}

export function keysToPairs(keys: string[], val: any): [unknown, unknown][] {
  return keys.map((key) => keyToKeyValuePair(val, key));
}
