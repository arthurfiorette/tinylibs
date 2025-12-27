<br />

[![Issues](https://img.shields.io/github/issues/arthurfiorette/tinylibs?logo=github&label=Issues)](https://github.com/arthurfiorette/tinylibs/issues)
[![Stars](https://img.shields.io/github/stars/arthurfiorette/tinylibs?logo=github&label=Stars)](https://github.com/arthurfiorette/tinylibs/stargazers)
[![License](https://img.shields.io/github/license/arthurfiorette/tinylibs?logo=githu&label=License)](https://github.com/arthurfiorette/tinylibs/blob/main/LICENSE)
[![Codecov](https://codecov.io/gh/arthurfiorette/tinylibs/branch/main/graph/badge.svg?token=ML0KGCU0VM)](https://codecov.io/gh/arthurfiorette/tinylibs)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_shield)
[![Join the chat at https://gitter.im/tinylibs-js-org/community](https://badges.gitter.im/tinylibs-js-org/community.svg)](https://gitter.im/tinylibs-js-org/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Speed Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)](https://twitter.com/acdlite/status/974390255393505280)

[![Latest Version](https://img.shields.io/npm/v/http-vary)](https://www.npmjs.com/package/http-vary)
[![Downloads](https://img.shields.io/npm/dw/http-vary)](https://www.npmjs.com/package/http-vary)
[![JsDelivr](https://data.jsdelivr.com/v1/package/npm/http-vary/badge?style=rounded)](https://www.jsdelivr.com/package/npm/http-vary)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/http-vary/latest?style=flat)](https://bundlephobia.com/package/http-vary@latest)
[![Packagephobia](https://packagephobia.com/badge?p=http-vary@latest)](https://packagephobia.com/result?p=http-vary@latest)

<br />

<div align="center">
  <pre>
  <h1>⌛<br />HTTP Vary</h1>
  </pre>
  <br />
</div>

<h3 align="center">
  <code>HTTP Vary</code> is a minimal parser and utility for the <a href="https://www.rfc-editor.org/rfc/rfc9110.html#name-vary" target="_blank">Vary</a> header (RFC 9110).
  <br />
  <br />
</h3>

<br />

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installing](#installing)
  - [Node](#node)
  - [Browser](#browser)
  - [Url Import](#url-import)
- [Getting Started](#getting-started)
  - [Usage](#usage)
- [Understanding Wildcard Behavior](#understanding-wildcard-behavior)
- [License](#license)

<br />

## Installing

### Node

```sh
npm install http-vary # or yarn add http-vary
```

```js
const { parse, compare } = require('http-vary');
import { parse, compare } from 'http-vary';
```

### Browser

```html
<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/http-vary@latest/dist/index.umd.js"
></script>
```

```js
const { parse, compare } = window.httpVary;
```

### Url Import

```ts
import { parse, compare } from 'https://cdn.skypack.dev/http-vary@latest';
```

<br />

## Getting Started

This package is a parser and utility for the HTTP Vary header as defined in
[RFC 9110 Section 12.5.5](https://www.rfc-editor.org/rfc/rfc9110.html#name-vary). The Vary
header indicates which request headers affect the response, enabling proper HTTP caching
behavior. You can parse a Vary header string with [`parse()`](./src/parse.ts) and compare
request headers for cache equivalence with [`compare()`](./src/compare.ts).

All needed documentation is available in form of `TSDoc` comments.

### Usage

```ts
import { parse, compare, VaryHeader } from 'http-vary';

// Parse a Vary header
const rawHeader = 'Accept-Encoding, User-Agent';

const vary = parse(rawHeader);
// => ['accept-encoding', 'user-agent']

// Parse wildcard
const wildcardVary = parse('*');
// => '*'

// Compare headers for cache equivalence
const headers1 = {
  'Accept-Encoding': 'gzip',
  'User-Agent': 'Chrome'
};

const headers2 = {
  'Accept-Encoding': 'gzip',
  'User-Agent': 'Chrome',
  Cookie: 'session=abc' // This header is ignored
};

const isEquivalent = compare(vary, headers1, headers2);
// => true (headers match for the fields specified in Vary)

// Case-insensitive header matching (per RFC 9110)
const headers3 = {
  'accept-encoding': 'gzip', // lowercase
  'USER-AGENT': 'Chrome' // uppercase
};

const caseInsensitiveMatch = compare(vary, headers1, headers3);
// => true (header names are matched case-insensitively)

// Wildcard always returns false
const wildcardMatch = compare('*', headers1, headers2);
// => false (wildcard indicates response varies on aspects beyond headers)
```

<br />

## Understanding Wildcard Behavior

Per [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-vary), `Vary: *` signals
that the response can vary based on **anything** about the request, including factors
beyond headers (e.g., client IP, time, server load, A/B testing). Since we cannot
determine if two requests would receive the same response, `compare()` always returns
`false` for wildcard, preventing incorrect cache hits.

**TL;DR**: `Vary: *` means "don't cache" - always consult the origin server.

<br />

## License

Licensed under the **MIT**. See [`LICENSE`](LICENSE) for more informations.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_small)

<br />
