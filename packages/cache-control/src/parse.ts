import type { CacheControl } from './index';
import { cacheControlSymbol } from './internal';
import { isDuration, isTruthy, parseHeadersString } from './util';

/**
 * Parses the Cache-Control header.
 *
 * You can check if a object was returned by this function with {@link isCacheControl}.
 *
 * @param {string} header The header to parse
 * @returns {CacheControl} The parsed cache control header
 */
export function parse(headerStr?: string): CacheControl {
  const header: CacheControl = Object.defineProperty({}, cacheControlSymbol, {
    enumerable: false,
    value: 1
  });

  if (!headerStr || typeof headerStr !== 'string') {
    return header;
  }

  const headers = parseHeadersString(headerStr);

  isTruthy(headers['immutable']) && (header.immutable = true);

  isDuration(headers['max-age']) && (header.maxAge = Number(headers['max-age']));
  isDuration(headers['max-stale']) && (header.maxStale = Number(headers['max-stale']));
  isDuration(headers['min-fresh']) && (header.minFresh = Number(headers['min-fresh']));

  isTruthy(headers['must-revalidate']) && (header.mustRevalidate = true);
  isTruthy(headers['must-understand']) && (header.mustUnderstand = true);
  isTruthy(headers['no-cache']) && (header.noCache = true);
  isTruthy(headers['no-store']) && (header.noStore = true);
  isTruthy(headers['no-transform']) && (header.noTransform = true);
  isTruthy(headers['only-if-cached']) && (header.onlyIfCached = true);
  isTruthy(headers['private']) && (header.private = true);
  isTruthy(headers['proxy-revalidate']) && (header.proxyRevalidate = true);
  isTruthy(headers['public']) && (header.public = true);

  isDuration(headers['s-maxage']) && (header.sMaxAge = Number(headers['s-maxage']));
  isDuration(headers['stale-if-error']) &&
    (header.staleIfError = Number(headers['stale-if-error']));
  isDuration(headers['stale-while-revalidate']) &&
    (header.staleWhileRevalidate = Number(headers['stale-while-revalidate']));

  return header;
}
