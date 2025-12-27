import { parse } from '../src/parse';

describe('parse() tests', () => {
  describe('Invalid inputs', () => {
    it('returns null for non-string inputs', () => {
      expect(parse()).toBe(null);

      //@ts-expect-error
      expect(parse(1)).toBe(null);

      //@ts-expect-error
      expect(parse({})).toBe(null);

      //@ts-expect-error
      expect(parse(Symbol())).toBe(null);

      //@ts-expect-error
      expect(parse(true)).toBe(null);

      //@ts-expect-error
      expect(parse(null)).toBe(null);
    });

    it('returns null for empty strings', () => {
      expect(parse('')).toBe(null);
      expect(parse('   ')).toBe(null);
      expect(parse('\t\t')).toBe(null);
      expect(parse('  \t  ')).toBe(null);
    });

    it('returns null for invalid header names', () => {
      expect(parse('α')).toBe(null);
      expect(parse('invalid!')).toBe(null);
      expect(parse('header@name')).toBe(null);
      expect(parse('header name')).toBe(null);
      expect(parse('héader')).toBe(null);
      expect(parse('header$')).toBe(null);
    });

    it('skips invalid header names but parses valid ones', () => {
      expect(parse('Accept-Encoding, invalid!, User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('invalid@, valid-header, bad$')).toEqual(['valid-header']);
    });
  });

  describe('Wildcard handling', () => {
    it('returns "*" for wildcard', () => {
      expect(parse('*')).toBe('*');
    });

    it('returns "*" if wildcard is present with other headers (RFC deviation)', () => {
      // Per RFC 9110, only '*' should be valid alone, but implementation handles
      // non-compliant servers
      expect(parse('*, Accept-Encoding')).toBe('*');
      expect(parse('Accept-Encoding, *')).toBe('*');
      expect(parse('Accept-Encoding, *, User-Agent')).toBe('*');
    });

    it('returns "*" for wildcard with whitespace', () => {
      expect(parse(' * ')).toBe('*');
      expect(parse('\t*\t')).toBe('*');
      expect(parse('  *  ')).toBe('*');
    });
  });

  describe('Single header field', () => {
    it('parses single header name', () => {
      expect(parse('Accept-Encoding')).toEqual(['accept-encoding']);
      expect(parse('User-Agent')).toEqual(['user-agent']);
      expect(parse('Accept-Language')).toEqual(['accept-language']);
    });

    it('normalizes to lowercase', () => {
      expect(parse('ACCEPT-ENCODING')).toEqual(['accept-encoding']);
      expect(parse('Accept-Encoding')).toEqual(['accept-encoding']);
      expect(parse('accept-encoding')).toEqual(['accept-encoding']);
      expect(parse('AcCePt-EnCoDiNg')).toEqual(['accept-encoding']);
    });

    it('trims whitespace', () => {
      expect(parse('  Accept-Encoding  ')).toEqual(['accept-encoding']);
      expect(parse('\tUser-Agent\t')).toEqual(['user-agent']);
      expect(parse('  Accept-Language  ')).toEqual(['accept-language']);
    });
  });

  describe('Multiple header fields', () => {
    it('parses comma-separated headers', () => {
      expect(parse('Accept-Encoding, User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('Accept-Encoding, User-Agent, Accept-Language')).toEqual([
        'accept-encoding',
        'user-agent',
        'accept-language'
      ]);
    });

    it('handles various whitespace combinations', () => {
      expect(parse('Accept-Encoding,User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('Accept-Encoding , User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('Accept-Encoding  ,  User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('Accept-Encoding\t,\tUser-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
    });

    it('deduplicates header names', () => {
      expect(parse('Accept-Encoding, Accept-Encoding')).toEqual(['accept-encoding']);
      expect(parse('Accept-Encoding, User-Agent, Accept-Encoding')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('accept-encoding, ACCEPT-ENCODING, Accept-Encoding')).toEqual([
        'accept-encoding'
      ]);
    });

    it('handles trailing/leading commas', () => {
      expect(parse(',Accept-Encoding')).toEqual(['accept-encoding']);
      expect(parse('Accept-Encoding,')).toEqual(['accept-encoding']);
      expect(parse(',Accept-Encoding,')).toEqual(['accept-encoding']);
      expect(parse(',,Accept-Encoding,,')).toEqual(['accept-encoding']);
    });

    it('handles multiple consecutive commas', () => {
      expect(parse('Accept-Encoding,,,User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
      expect(parse('Accept-Encoding, , ,User-Agent')).toEqual([
        'accept-encoding',
        'user-agent'
      ]);
    });
  });

  describe('Valid header name characters', () => {
    it('allows alphanumeric and hyphens', () => {
      expect(parse('X-Custom-Header')).toEqual(['x-custom-header']);
      expect(parse('X-Custom-Header-123')).toEqual(['x-custom-header-123']);
      expect(parse('Accept123')).toEqual(['accept123']);
    });

    it('allows headers starting with numbers', () => {
      expect(parse('1-Custom-Header')).toEqual(['1-custom-header']);
      expect(parse('9X-Header')).toEqual(['9x-header']);
    });

    it('allows single character headers', () => {
      expect(parse('X')).toEqual(['x']);
      expect(parse('a')).toEqual(['a']);
      expect(parse('1')).toEqual(['1']);
    });
  });

  describe('DoS protection (maxLength)', () => {
    it('limits number of parsed headers to default 16', () => {
      const headers = Array.from({ length: 20 }, (_, i) => `header-${i}`).join(', ');
      const result = parse(headers);
      expect(result).not.toBe(null);
      expect((result as string[]).length).toBe(16);
    });

    it('respects custom maxLength', () => {
      const headers = Array.from({ length: 10 }, (_, i) => `header-${i}`).join(', ');

      const result5 = parse(headers, 5);
      expect(result5).not.toBe(null);
      expect((result5 as string[]).length).toBe(5);

      const result3 = parse(headers, 3);
      expect(result3).not.toBe(null);
      expect((result3 as string[]).length).toBe(3);
    });

    it('handles maxLength of 1', () => {
      const result = parse('Accept-Encoding, User-Agent', 1);
      expect(result).toEqual(['accept-encoding']);
    });

    it('allows parsing all headers if under maxLength', () => {
      const headers = Array.from({ length: 5 }, (_, i) => `header-${i}`).join(', ');
      const result = parse(headers, 10);
      expect(result).not.toBe(null);
      expect((result as string[]).length).toBe(5);
    });
  });

  describe('RFC 9110 compliance', () => {
    it('handles common standard headers', () => {
      expect(parse('Accept')).toEqual(['accept']);
      expect(parse('Accept-Charset')).toEqual(['accept-charset']);
      expect(parse('Accept-Encoding')).toEqual(['accept-encoding']);
      expect(parse('Accept-Language')).toEqual(['accept-language']);
      expect(parse('Authorization')).toEqual(['authorization']);
      expect(parse('User-Agent')).toEqual(['user-agent']);
      expect(parse('Cookie')).toEqual(['cookie']);
      expect(parse('Origin')).toEqual(['origin']);
    });

    it('handles custom headers with X- prefix', () => {
      expect(parse('X-Requested-With')).toEqual(['x-requested-with']);
      expect(parse('X-Custom-Header')).toEqual(['x-custom-header']);
    });

    it('handles typical Vary header combinations', () => {
      expect(parse('Accept-Encoding')).toEqual(['accept-encoding']);
      expect(parse('Accept-Encoding, Accept-Language')).toEqual([
        'accept-encoding',
        'accept-language'
      ]);
      expect(parse('User-Agent, Accept-Encoding')).toEqual([
        'user-agent',
        'accept-encoding'
      ]);
      expect(parse('Accept, Accept-Encoding, Accept-Language')).toEqual([
        'accept',
        'accept-encoding',
        'accept-language'
      ]);
    });
  });

  describe('Edge cases', () => {
    it('handles very long header names', () => {
      const longHeader = 'a'.repeat(100);
      expect(parse(longHeader)).toEqual([longHeader]);
    });

    it('handles mixed valid and invalid characters', () => {
      expect(parse('valid-header, invalid header, another-valid')).toEqual([
        'valid-header',
        'another-valid'
      ]);
    });

    it('handles headers with only hyphens', () => {
      expect(parse('-')).toEqual(['-']);
      expect(parse('--')).toEqual(['--']);
    });

    it('returns array for single valid header (not wildcard)', () => {
      const result = parse('Accept');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['accept']);
    });
  });
});
