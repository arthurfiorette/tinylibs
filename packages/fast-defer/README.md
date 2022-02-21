<br />
<div align="center">
  <pre>
  <br />
  <h1>🕔🚀
Fast Defer</h1>
  <br />
  </pre>
  <br />
  <br />
  <code
    ><a href="https://github.com/ArthurFiorette/fast-defer/stargazers"
      ><img
        src="https://img.shields.io/github/stars/ArthurFiorette/fast-defer?logo=github&label=Stars"
        target="_blank"
        alt="Stars" /></a
  ></code>
  <code
    ><a href="https://github.com/ArthurFiorette/fast-defer/blob/main/LICENSE"
      ><img
        src="https://img.shields.io/github/license/ArthurFiorette/fast-defer?logo=githu&label=License"
        target="_blank"
        alt="License" /></a
  ></code>
  <code
    ><a href="https://bundlephobia.com/package/fast-defer"
      ><img
        src="https://img.shields.io/bundlephobia/min/fast-defer?style=flat"
        target="_blank"
        alt="Size" /></a
  ></code>
  <code
    ><a href="https://www.npmjs.com/package/fast-defer"
      ><img
        src="https://img.shields.io/npm/dw/fast-defer?style=flat"
        target="_blank"
        alt="Downloads NPM" /></a
  ></code>
  <code
    ><a href="https://app.codecov.io/gh/arthurfiorette/fast-defer/"
      ><img
        src="https://codecov.io/gh/arthurfiorette/fast-defer/branch/main/graph/badge.svg?token=pdslRMQDtC"
        target="_blank"
        alt="Coverage" /></a
  ></code>
</div>

<h1></h1>

<br />
<br />

### `fast-defer` is a fast and minimal deferred implementation for javascript

<br />
<br />

## Table of contents

- [Table of contents](#table-of-contents)
- [Installing](#installing)
    - [Node](#node)
    - [Browser](#browser)
- [Browser Compatibility](#browser-compatibility)
- [Getting Started](#getting-started)
- [License](#license)

<br />

## Installing

#### Node

```sh
npm install --save fast-defer
# or
yarn add fast-defer
```

```js
const { deferred, isDeferred } = require('fast-defer');
// or
import { deferred, isDeferred } from 'fast-defer';
```

#### Browser

![Npm](https://img.shields.io/npm/v/fast-defer?style=flat)

```html
<!-- Replace latest with the desired version -->

<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/fast-defer@latest/index.min.js"
></script>
<!-- or -->
<script crossorigin src="https://unpkg.com/fast-defer@latest/index.min.js"></script>
```

```js
const { deferred, isDeferred } = window.FastDefer;
```

<br />

## Browser Compatibility

|                                                                                                                                         | Chrome | Edge | Firefox | Internet Explorer | Opera | Safari | Node.js | Deno | WebView Android | Chrome Android | Firefox for Android | Opera Android | Safari on iOS | Samsung Internet |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---- | ------- | ----------------- | ----- | ------ | ------- | ---- | --------------- | -------------- | ------------------- | ------------- | ------------- | ---------------- |
| [Promise() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#browser_compatibility) | 32     | 12   | 29\*    | X                 | 19    | 8      | 0.12    | 1.0  | 4.4.3           | 32             | 29\*                | 19            | 8\*           | 2.0              |
| [Symbol() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#browser_compatibility)   | 38     | 12   | 36      | X                 | 25    | 9      | 0.12    | 1.0  | 38              | 38             | 36                  | 25            | 9             | 3.0              |

<br />

## Getting Started

Fast defer is nothing more than a promise that you can resolve or reject later.

```js
import { deferred, isDeferred } from 'fast-defer';

const waitingSomething = deferred();

waitingSomething.then((val) => {
  console.log('Resolved');
});

waitingSomething.catch((error) => {
  console.log('Rejected');
});

// Other file, function or etc
someCallback((response, error) => {
  if (error) {
    waitingSomething.reject(error);
  } else {
    waitingSomething.resolve(response);
  }
});
```

<br />

## License

Licensed under the **MIT**.

<br />
