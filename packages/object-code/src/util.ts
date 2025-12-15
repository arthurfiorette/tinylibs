export function sortNumbers(a: string, b: string) {
  return a > b ? 1 : -1;
}

export function sortPairsByKey(a: [unknown, unknown], b: [unknown, unknown]) {
  return sortNumbers(String(a[0]), String(b[0]));
}

/**
 * Fast mixing using DJB2-style algorithm with XOR. Bitwise operations are much faster
 * than modulo.
 */
export function mix(h: number, value: number): number {
  return (h * 33) ^ value;
}

/**
 * Normalizes special numeric values to prevent collisions. Returns a safe integer
 * representation.
 */
export function normalizeNumber(val: number): number {
  if (Number.isNaN(val)) return 0x7ff80000;
  if (val === Infinity) return 0x7ff00000;
  if (val === -Infinity) return 0xfff00000;

  // For very large numbers, hash them as strings to avoid precision loss
  if (Math.abs(val) > Number.MAX_SAFE_INTEGER) {
    // Convert to string and hash the string representation
    const str = String(val);
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = mix(h, str.charCodeAt(i));
    }
    return h;
  }

  return val;
}
