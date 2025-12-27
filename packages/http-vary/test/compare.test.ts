import { compare } from '../src/compare';
import type { CompareHeaders, VaryHeader } from '../src/types';

describe('compare() tests', () => {
  describe('Wildcard behavior', () => {
    it('always returns false for wildcard vary', () => {
      const headers1 = { 'Accept-Encoding': 'gzip' };
      const headers2 = { 'Accept-Encoding': 'gzip' };

      expect(compare('*', headers1, headers2)).toBe(false);
    });

    it('returns false for wildcard even with identical headers', () => {
      const headers = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Chrome',
        'Accept-Language': 'en-US'
      };

      expect(compare('*', headers, headers)).toBe(false);
    });

    it('returns false for wildcard with empty headers', () => {
      expect(compare('*', {}, {})).toBe(false);
    });
  });

  describe('Matching headers', () => {
    it('returns true for matching single header', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1: CompareHeaders = { 'Accept-Encoding': 'gzip' };
      const headers2: CompareHeaders = { 'Accept-Encoding': 'gzip' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('returns true for matching multiple headers', () => {
      const vary: VaryHeader = ['accept-encoding', 'user-agent'];
      const headers1 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Chrome'
      };
      const headers2 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Chrome'
      };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('ignores headers not in vary', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Chrome',
        Cookie: 'session=123'
      };
      const headers2 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Firefox',
        Cookie: 'session=456'
      };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });
  });

  describe('Non-matching headers', () => {
    it('returns false for different header values', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = { 'Accept-Encoding': 'gzip' };
      const headers2 = { 'Accept-Encoding': 'br' };

      expect(compare(vary, headers1, headers2)).toBe(false);
    });

    it('returns false when one header is missing', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = { 'Accept-Encoding': 'gzip' };
      const headers2 = {};

      expect(compare(vary, headers1, headers2)).toBe(false);
    });

    it('returns false for multiple headers with one mismatch', () => {
      const vary: VaryHeader = ['accept-encoding', 'user-agent'];
      const headers1 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Chrome'
      };
      const headers2 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Firefox'
      };

      expect(compare(vary, headers1, headers2)).toBe(false);
    });
  });

  describe('Case sensitivity', () => {
    it('is case-insensitive for header names', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = { 'Accept-Encoding': 'gzip' };
      const headers2 = { 'ACCEPT-ENCODING': 'gzip' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('is case-sensitive for header values', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = { 'Accept-Encoding': 'GZIP' };
      const headers2 = { 'Accept-Encoding': 'gzip' };

      expect(compare(vary, headers1, headers2)).toBe(false);
    });
  });

  describe('Whitespace handling', () => {
    it('trims header values before comparison', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = { 'Accept-Encoding': '  gzip  ' };
      const headers2 = { 'Accept-Encoding': 'gzip' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('handles tabs and other whitespace', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = { 'Accept-Encoding': '\tgzip\t' };
      const headers2 = { 'Accept-Encoding': 'gzip' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });
  });

  describe('Missing headers', () => {
    it('distinguishes between missing and empty string', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = {};
      const headers2: CompareHeaders = { 'Accept-Encoding': '' };

      // missing (undefined) != '' (empty string)
      expect(compare(vary, headers1, headers2)).toBe(false);
    });

    it('treats missing headers as equivalent', () => {
      const vary: VaryHeader = ['accept-encoding'];
      const headers1 = {};
      const headers2 = {};

      // Both missing/undefined
      expect(compare(vary, headers1, headers2)).toBe(true);
    });
  });

  describe('Empty string handling', () => {
    it('matches empty strings', () => {
      const vary: VaryHeader = ['x-custom'];
      const headers1: CompareHeaders = { 'X-Custom': '' };
      const headers2: CompareHeaders = { 'X-Custom': '' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('distinguishes empty string from missing header', () => {
      const vary: VaryHeader = ['x-custom'];
      const headers1: CompareHeaders = { 'X-Custom': '' };
      const headers2 = {};

      // '' != undefined (missing)
      expect(compare(vary, headers1, headers2)).toBe(false);
    });
  });

  describe('Array header values', () => {
    it('converts array values to comma-separated string', () => {
      const vary: VaryHeader = ['accept'];
      const headers1: CompareHeaders = { Accept: ['text/html', 'application/json'] };
      const headers2: CompareHeaders = { Accept: 'text/html,application/json' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('handles arrays with whitespace', () => {
      const vary: VaryHeader = ['accept'];
      const headers1: CompareHeaders = { Accept: ['text/html', ' application/json '] };
      const headers2: CompareHeaders = { Accept: 'text/html, application/json' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('matches identical arrays', () => {
      const vary: VaryHeader = ['accept'];
      const headers1: CompareHeaders = { Accept: ['text/html', 'application/json'] };
      const headers2: CompareHeaders = { Accept: ['text/html', 'application/json'] };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });

    it('detects different array values', () => {
      const vary: VaryHeader = ['accept'];
      const headers1: CompareHeaders = { Accept: ['text/html'] };
      const headers2: CompareHeaders = { Accept: ['application/json'] };

      expect(compare(vary, headers1, headers2)).toBe(false);
    });

    it('handles empty arrays as empty string', () => {
      const vary: VaryHeader = ['accept'];
      const headers1: CompareHeaders = { Accept: [] };
      const headers2: CompareHeaders = { Accept: '' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });
  });

  describe('Empty vary array', () => {
    it('returns true for empty vary array', () => {
      const vary: VaryHeader = [];
      const headers1 = { 'Accept-Encoding': 'gzip' };
      const headers2 = { 'Accept-Encoding': 'br' };

      expect(compare(vary, headers1, headers2)).toBe(true);
    });
  });

  describe('Complex scenarios', () => {
    it('handles typical caching scenario', () => {
      const vary: VaryHeader = ['accept-encoding', 'accept-language'];

      // Same request from same user
      const req1 = {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Chrome/120.0',
        Cookie: 'session=abc123'
      };

      const req2 = {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Chrome/120.0',
        Cookie: 'session=xyz789'
      };

      expect(compare(vary, req1, req2)).toBe(true);
    });

    it('detects different encoding preferences', () => {
      const vary: VaryHeader = ['accept-encoding'];

      const req1 = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Chrome'
      };

      const req2 = {
        'Accept-Encoding': 'br',
        'User-Agent': 'Chrome'
      };

      expect(compare(vary, req1, req2)).toBe(false);
    });

    it('handles real-world vary headers', () => {
      // Common CDN vary header
      const vary: VaryHeader = ['accept-encoding', 'user-agent'];

      const mobileRequest = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      };

      const desktopRequest = {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      };

      expect(compare(vary, mobileRequest, desktopRequest)).toBe(false);
    });
  });

  describe('RFC 9110 compliance', () => {
    it('correctly handles vary on Authorization', () => {
      const vary: VaryHeader = ['authorization'];

      const authRequest = { Authorization: 'Bearer token123' };
      const noAuthRequest = {};

      expect(compare(vary, authRequest, noAuthRequest)).toBe(false);
      expect(compare(vary, authRequest, authRequest)).toBe(true);
    });

    it('correctly handles vary on Accept', () => {
      const vary: VaryHeader = ['accept'];

      const jsonRequest = { Accept: 'application/json' };
      const htmlRequest = { Accept: 'text/html' };

      expect(compare(vary, jsonRequest, htmlRequest)).toBe(false);
      expect(compare(vary, jsonRequest, jsonRequest)).toBe(true);
    });
  });
});
