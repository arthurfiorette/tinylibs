<br />

<div align="center">
  <pre>
  <br />
  <h1>⛓️
Object Code</h1>
  <br />
  </pre>
  <br />
  <br />
  <code
    ><a href="https://github.com/ArthurFiorette/object-code/stargazers"
      ><img
        src="https://img.shields.io/github/stars/ArthurFiorette/object-code?logo=github&label=Stars"
        target="_blank"
        alt="Stars" /></a
  ></code>
  <code
    ><a href="https://github.com/ArthurFiorette/object-code/blob/main/LICENSE"
      ><img
        src="https://img.shields.io/github/license/ArthurFiorette/object-code?logo=githu&label=License"
        target="_blank"
        alt="License" /></a
  ></code>
  <code
    ><a href="https://bundlephobia.com/package/object-code"
      ><img
        src="https://img.shields.io/bundlephobia/min/object-code?style=flat"
        target="_blank"
        alt="Size" /></a
  ></code>
  <code
    ><a href="https://www.npmjs.com/package/object-code"
      ><img
        src="https://img.shields.io/npm/dw/object-code?style=flat"
        target="_blank"
        alt="Downloads NPM" /></a
  ></code>
  <code
    ><a href="https://app.codecov.io/gh/arthurfiorette/object-code/"
      ><img
        src="https://codecov.io/gh/arthurfiorette/object-code/branch/main/graph/badge.svg?token=pdslRMQDtC"
        target="_blank"
        alt="Coverage" /></a
  ></code>
</div>

<h1></h1>

<br />
<br />

### `object-code` is a blazing fast hash code generator that supports every possible javascript value.

<br />
<br />

## Table of contents

- [Table of contents](#table-of-contents)
- [Installing](#installing)
  - [Node](#node)
  - [Browser](#browser)
- [Getting Started](#getting-started)
- [Types compatibility](#types-compatibility)
- [Version compatibility](#version-compatibility)
- [Benchmark](#benchmark)
- [License](#license)

<br />

## Installing

#### Node

```sh
npm install --save object-code
# or
yarn add object-code
```

```js
const { hashCode } = require('object-code');
// or
import { hashCode } from 'object-code';
```

#### Browser

![Npm](https://img.shields.io/npm/v/object-code?style=flat)

```html
<!-- Replace latest with the desired version -->

<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/object-code@latest/index.min.js"
></script>
<!-- or -->
<script crossorigin src="https://unpkg.com/object-code@latest/index.min.js"></script>
```

```js
const { hashCode } = window.objectCode;
```

<br />

## Getting Started

Fast hash is an blazing fast object hash code generator. It generates unique hashes for
objects, arrays, functions, symbols and etc.

You can use it to index objects in a object/array/map/set, to compare objects or to just
generate unique ids.

```js
import { hashCode } from 'object-code';

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
  birth: new Date(1990, 1, 1),
  tags: ['person', 'male', 'programmer']
  // etc
};

const hash = hashCode(myWeirdObject);
// 1230491235
```

## Types compatibility

See all unique values at [`test/values.ts`](test/values.ts)

## Version compatibility

This library is always seeking an faster implementation, doesn't matter if the hash code
will change.

You shouldn't rely on cross version compatibility, and even if so, run some tests before
upgrading.

I'll make an note on hash generation changes.

## Benchmark

[Simple benchmark with `object-hash` and this package.](https://github.com/arthurfiorette/object-code/blob/dd43ebb82d01b30708050fb7e3e2f917ce20cce0/test/benchmark.js)

```sh
# node dist/benchmark.js

Number of generated hashes per second
Total of 100000 runs

Object tests:

0: object-code -> 35,984 runs/s
1: object-hash -> 11,307 runs/s


Json tests:

0: object-code -> 571,429 runs/s
1: object-hash -> 218,341 runs/s


Raw string tests:

0: object-code -> 3,448,276 runs/s
1: object-hash -> 251,192 runs/s
```

<br />

## License

Licensed under the **MIT**.

<br />
