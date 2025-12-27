import type { VaryHeader } from './types';

const VALID_HEADER_NAME_REGEX = /^[a-z0-9-]+$/i;

/**
 * Parses the Vary header as defined in
 * {@link https://www.rfc-editor.org/rfc/rfc9110.html#name-vary RFC 9110 Section 12.5.5}.
 *
 * The Vary header indicates which request headers a server considers when selecting or
 * generating a response, enabling proper HTTP caching behavior.
 *
 * @remarks
 * - Header field names are normalized to lowercase
 * - Duplicate fields are automatically deduplicated
 * - Invalid header names (per RFC 9110) are silently skipped
 * - If the header contains `'*'`, the function returns `'*'` (wildcard)
 * - Returns `null` for invalid input or when no valid fields are found
 *
 * @example
 *
 * ```ts
 * parse('Accept-Encoding, User-Agent');
 * // => ['accept-encoding', 'user-agent']
 *
 * parse('*');
 * // => '*'
 *
 * parse('Invalid Header!');
 * // => null
 * ```
 *
 * @param {string} headerStr - The Vary header value to parse (e.g., "Accept-Encoding,
 *   User-Agent")
 * @param {number} [maxLength=16] - Maximum number of header fields to parse for DoS
 *   protection. Default is `16`
 * @returns {VaryHeader | null} The parsed Vary header as an array of lowercase field
 *   names, `'*'` for wildcard, or `null` if invalid.
 */
export function parse(headerStr?: string, maxLength = 16): VaryHeader | null {
  // Invalid header name
  if (typeof headerStr !== 'string') {
    return null;
  }

  // RFC says only '*' is valid alone, but some servers may send invalid headers like '*, Accept-Encoding'
  if (headerStr.includes('*')) {
    return '*';
  }

  const values = new Set<string>();

  for (let i = 0; i < headerStr.length; i++) {
    const char = headerStr[i];

    if (char === ' ' || char === '\t' || char === ',') {
      continue;
    }

    const start = i;

    while (i < headerStr.length) {
      const char = headerStr[i];

      if (char === ',') {
        break;
      }

      i++;
    }

    const headerName = headerStr.slice(start, i).trim().toLowerCase();

    // Skip invalid header names
    if (headerName.length === 0 || !VALID_HEADER_NAME_REGEX.test(headerName)) {
      continue;
    }

    values.add(headerName);

    // DOS protection to avoid overly large vary headers
    if (values.size >= maxLength) {
      break;
    }
  }

  // Ensures no empty set is returned
  if (values.size === 0) {
    return null;
  }

  return Array.from(values);
}
