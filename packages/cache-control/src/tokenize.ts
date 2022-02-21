/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { CacheControl } from './index';
import { isDuration, isTruthy } from './util';

/**
 * Return an array of tokens from the header object.
 *
 * #### The output is sorted by alphabetical order
 *
 * The cache control object does not need to be a CacheControl object from the
 * {@link CacheControl}.This means that the parameter do not have to pass in the
 * {@link isCacheControl} function.
 *
 * You can build a string with `.join(', ')` method.
 *
 * @example
 *
 * ```js
 * const tokens = tokenize({ maxAge: 3600, noCache: true }); // ['max-age=3600',
 * 'no-cache']
 *
 * const header = tokens.join(', '); // 'max-age=3600, no-cache'
 * ```
 *
 * @param header The cache control object
 * @returns An array of directives an their respective values.
 */
export function tokenize(header?: CacheControl): string[] {
  if (!header || typeof header !== 'object') {
    return [];
  }

  const tokens: string[] = [];

  isTruthy(header.immutable) && tokens.push('immutable');

  isDuration(header.maxAge) && tokens.push(`max-age=${header.maxAge}`);
  isDuration(header.maxStale) && tokens.push(`max-stale=${header.maxStale}`);
  isDuration(header.minFresh) && tokens.push(`min-fresh=${header.minFresh}`);

  isTruthy(header.mustRevalidate) && tokens.push('must-revalidate');
  isTruthy(header.mustUnderstand) && tokens.push('must-understand');
  isTruthy(header.noCache) && tokens.push('no-cache');
  isTruthy(header.noStore) && tokens.push('no-store');
  isTruthy(header.noTransform) && tokens.push('no-transform');
  isTruthy(header.onlyIfCached) && tokens.push('only-if-cached');
  isTruthy(header.private) && tokens.push('private');
  isTruthy(header.proxyRevalidate) && tokens.push('proxy-revalidate');
  isTruthy(header.public) && tokens.push('public');

  isDuration(header.sMaxAge) && tokens.push(`s-maxage=${header.sMaxAge}`);
  isDuration(header.staleIfError) && tokens.push(`stale-if-error=${header.staleIfError}`);
  isDuration(header.staleWhileRevalidate) &&
    tokens.push(`stale-while-revalidate=${header.staleWhileRevalidate}`);

  return tokens;
}
