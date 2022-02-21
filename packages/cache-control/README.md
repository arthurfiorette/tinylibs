<br />
<div align="center">
  <pre>
  <br />
  <h1>⌛
Cache Parser</h1>
  <br />
  </pre>
  <br />
  <br />
  <code
    ><a href="https://github.com/ArthurFiorette/cache-parser/stargazers"
      ><img
        src="https://img.shields.io/github/stars/ArthurFiorette/cache-parser?logo=github&label=Stars"
        target="_blank"
        alt="Stars" /></a
  ></code>
  <code
    ><a href="https://github.com/ArthurFiorette/cache-parser/blob/main/LICENSE"
      ><img
        src="https://img.shields.io/github/license/ArthurFiorette/cache-parser?logo=githu&label=License"
        target="_blank"
        alt="License" /></a
  ></code>
  <code
    ><a href="https://bundlephobia.com/package/cache-parser"
      ><img
        src="https://img.shields.io/bundlephobia/min/cache-parser?style=flat"
        target="_blank"
        alt="Size" /></a
  ></code>
  <code
    ><a href="https://www.npmjs.com/package/cache-parser"
      ><img
        src="https://img.shields.io/npm/dw/cache-parser?style=flat"
        target="_blank"
        alt="Downloads NPM" /></a
  ></code>
  <code
    ><a href="https://app.codecov.io/gh/arthurfiorette/cache-parser/"
      ><img
        src="https://codecov.io/gh/arthurfiorette/cache-parser/branch/main/graph/badge.svg?token=pdslRMQDtC"
        target="_blank"
        alt="Coverage" /></a
  ></code>
</div>

<h1></h1>

<br />
<br />

### `cache-parser` is a minimal parser for the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header

<br />
<br />

## Table of contents

- [Table of contents](#table-of-contents)
- [Installing](#installing)
  - [Node](#node)
  - [Browser](#browser)
- [Getting Started](#getting-started)
  - [Some examples](#some-examples)
- [License](#license)

<br />

## Installing

#### Node

```sh
npm install --save cache-parser
# or
yarn add cache-parser
```

```js
const { parse, tokenize } = require('cache-parser');
// or
import { parse, tokenize } from 'cache-parser';
```

#### Browser

![Downloads](https://img.shields.io/npm/v/cache-parser?style=flat)

```html
<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/cache-parser@1/index.umd.js"
></script>
<!-- or -->
<script crossorigin src="https://unpkg.com/cache-parser@1/dist/index.umd.js"></script>
```

```js
const { parse, tokenize } = window.CacheParser;
```

<br />

## Getting Started

This library consists of two important functions: [`parse`](src/parse.ts) and
[`tokenize`](src/tokenize.ts).

This is a pretty straightforward library, so, every documentation needed by every piece of
code is in form of `TSDoc` and `JSDoc` comments.

### Some examples

Simple header parsing:

```js
import { parse } from 'cache-parser';

const rawHeader = 'public, max-age=3600';

const { public, maxAge, immutable } = parse(rawHeader);

console.log(public); // true
console.log(maxAge); // 3600
console.log(typeof maxAge); // number
console.log(immutable); // undefined
```

Simple header building:

```ts
import { tokenize } from 'cache-parser';

/** @type {import('cache-parser').CacheControl} */
const cacheProperties = { public: true, maxAge: 3600 };

// ['public', 'max-age=3600']
const cacheTokens = tokenize(cacheProperties);

// 'public, max-age=3600'
response.headers['Cache-Control'] = tokens.join(', ');
```

<br />

## License

Licensed under the **MIT**.

<br />
