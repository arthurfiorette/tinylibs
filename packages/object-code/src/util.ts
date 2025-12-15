export function sortNumbers(a: string, b: string) {
  return a > b ? 1 : -1;
}

export function entriesToPairs(val: any): [unknown, unknown][] {
  return Array.from(val.entries()) as [unknown, unknown][];
}

export function keysToPairs(keys: string[], val: any): [unknown, unknown][] {
  return keys.map((key) => [key, val[key]] as [unknown, unknown]);
}
