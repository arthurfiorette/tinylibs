export function sortNumbers(a: string, b: string) {
  return a > b ? 1 : -1;
}

export function sortPairsByKey(a: [unknown, unknown], b: [unknown, unknown]) {
  return sortNumbers(String(a[0]), String(b[0]));
}

export function pairFromKey(val: any, key: string): [unknown, unknown] {
  return [key, val[key as keyof typeof val]] as [unknown, unknown];
}
