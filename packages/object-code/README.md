<br />

[![Issues](https://img.shields.io/github/issues/arthurfiorette/tinylibs?logo=github&label=Issues)](https://github.com/arthurfiorette/tinylibs/issues)
[![Stars](https://img.shields.io/github/stars/arthurfiorette/tinylibs?logo=github&label=Stars)](https://github.com/arthurfiorette/tinylibs/stargazers)
[![License](https://img.shields.io/github/license/arthurfiorette/tinylibs?logo=githu&label=License)](https://github.com/arthurfiorette/tinylibs/blob/main/LICENSE)
[![Codecov](https://codecov.io/gh/arthurfiorette/tinylibs/branch/main/graph/badge.svg?token=ML0KGCU0VM)](https://codecov.io/gh/arthurfiorette/tinylibs)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_shield)
[![Join the chat at https://gitter.im/tinylibs-js-org/community](https://badges.gitter.im/tinylibs-js-org/community.svg)](https://gitter.im/tinylibs-js-org/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Speed Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)](https://twitter.com/acdlite/status/974390255393505280)

[![Latest Version](https://img.shields.io/npm/v/object-code)](https://www.npmjs.com/package/object-code)
[![Downloads](https://img.shields.io/npm/dw/object-code)](https://www.npmjs.com/package/object-code)
[![JsDelivr](https://data.jsdelivr.com/v1/package/npm/object-code/badge?style=rounded)](https://www.jsdelivr.com/package/npm/object-code)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/object-code/latest?style=flat)](https://bundlephobia.com/package/object-code@latest)
[![Packagephobia](https://packagephobia.com/badge?p=object-code@latest)](https://packagephobia.com/result?p=object-code@latest)

<br />

<div align="center">
  <pre>
  <h1>⛓️<br />Object Code</h1>
  </pre>
  <br />
</div>

<h3 align="center">
  <code>Object Code</code> is a blazing fast hash code generator that supports every possible javascript value.
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
- [Hashing \& Collision Resistance](#hashing--collision-resistance)
  - [How it works](#how-it-works)
  - [Collision Probability](#collision-probability)
- [Compatibility](#compatibility)
- [Benchmark](#benchmark)
- [License](#license)

<br />

## Installing

### Node

```sh
npm install object-code # or yarn add object-code
```

```js
const { hash } = require('object-code');
import { hash } from 'object-code';
```

### Browser

```html
<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/object-code@latest/dist/index.umd.js"
></script>
```

```js
const { hash } = window.objectCode;
```

### Url Import

```ts
import { hash } from 'https://cdn.skypack.dev/object-code@latest';
```

<br />

## Getting Started

Object code is a blazing fast hash code generator. It generates unique signed integers for
objects, arrays, functions, symbols and etc.

You can ise it to index object in a collection, compare objects or just generate unique
identifiers.

```js
import { hash } from 'object-code';

const myWeirdObject = {
  name: 'Arthur',
  age: 20,
  address: {
    private: true
  },
  sayHello: function () {
    console.log('Hello!');
  },
  id: Symbol('arthur'),
  birth: new Date(2005, 02, 27),
  tags: ['person', 'male', 'programmer']
  recursive: myWeirdObject,
  // etc
};

const hash = hash(myWeirdObject);
// -1352827948
```

<br />

## Hashing & Collision Resistance

Object Code uses a modified **DJB2 algorithm** with special handling for edge cases to
provide excellent collision resistance while maintaining high performance.

### How it works

- Uses bitwise XOR operations (much faster than cryptographic hashing)
- Hashes the type separately from the value to prevent cross-type collisions
- NaN, Infinity, -Infinity, and very large numbers are normalized to prevent collisions
- Objects and arrays are hashed recursively with circular reference detection

### Collision Probability

The hash function produces 32-bit signed integers, giving approximately **4.3 billion**
unique values. While not cryptographically secure, it provides:

- **Zero collisions** in our test suite of hundreds of diverse values (including edge
  cases)
- Excellent distribution for typical use cases (object indexing, memoization, comparison)
- Special handling to avoid common collision patterns

**Note**: This is a **non-cryptographic** hash function optimized for speed. Don't use it
for security purposes like password hashing or data integrity verification.

<br />

## Compatibility

See all unique values at [`test/values.ts`](test/values.ts)

This package is always seeking for a faster implementation. This means that we don't
guarantee that the hash will be the same for two different versions of this package. There
will be an warning on the release notes if the hash generation changed.

You shouldn't rely on cross version compatibility, and even if so, you can run some tests
before pushing to production :)

<br />

## Benchmark

This is the result of a [benchmark](./benchmark/benchmark.js) between `object-hash` and
`object-code`:

```txt
Running "Benchmark (Object)" suite...
Progress: 100%

  Object Code:
    214 853 ops/s, ±0.73%   | fastest

  Object Hash:
    24 568 ops/s, ±0.65%    | slowest, 88.57% slower

Running "Benchmark (Jsonified Object)" suite...
Progress: 100%

  Object Code:
    201 261 ops/s, ±0.63%   | fastest

  Object Hash:
    135 867 ops/s, ±0.63%   | slowest, 32.49% slower

Running "Benchmark (String)" suite...
Progress: 100%

  Object Code:
    2 112 297 ops/s, ±1.37%   | fastest

  Object Hash:
    381 451 ops/s, ±1.62%     | slowest, 81.94% slower
```

<br />

## License

Licensed under the **MIT**. See [`LICENSE`](LICENSE) for more informations.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_small)

<br />
