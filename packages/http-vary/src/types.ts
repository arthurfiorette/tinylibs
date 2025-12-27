/**
 * Type representing the Vary header as defined in
 * {@link https://www.rfc-editor.org/rfc/rfc9110.html#name-vary RFC 9110 Section 12.5.5}.
 *
 * The Vary header field indicates which request headers affect the response, enabling
 * proper cache key generation.
 *
 * - `'*'` - Wildcard indicating the response varies on aspects beyond headers
 * - `string[]` - Array of lowercase header field names that affect the response
 *
 * @remarks
 * The array is never empty and all header names are normalized to lowercase.
 */
export type VaryHeader = string[] | '*';

/**
 * Type representing HTTP headers. Header values can be strings, arrays of strings, or
 * undefined.
 */
export type HttpHeaders = Record<string, string | string[] | undefined>;

/**
 * Type representing HTTP headers for comparison. Values must be strings or arrays (no
 * undefined).
 */
export type CompareHeaders = Record<string, any>;
