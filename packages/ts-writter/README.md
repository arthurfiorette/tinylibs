<br />

[![Issues](https://img.shields.io/github/issues/arthurfiorette/tinylibs?logo=github&label=Issues)](https://github.com/arthurfiorette/tinylibs/issues)
[![Stars](https://img.shields.io/github/stars/arthurfiorette/tinylibs?logo=github&label=Stars)](https://github.com/arthurfiorette/tinylibs/stargazers)
[![License](https://img.shields.io/github/license/arthurfiorette/tinylibs?logo=githu&label=License)](https://github.com/arthurfiorette/tinylibs/blob/main/LICENSE)
[![Codecov](https://codecov.io/gh/arthurfiorette/tinylibs/branch/main/graph/badge.svg?token=ML0KGCU0VM)](https://codecov.io/gh/arthurfiorette/tinylibs)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_shield)
[![Join the chat at https://gitter.im/tinylibs-js-org/community](https://badges.gitter.im/tinylibs-js-org/community.svg)](https://gitter.im/tinylibs-js-org/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Speed Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)](https://twitter.com/acdlite/status/974390255393505280)

[![Latest Version](https://img.shields.io/npm/v/ts-writer)](https://www.npmjs.com/package/ts-writer)
[![Downloads](https://img.shields.io/npm/dw/ts-writer)](https://www.npmjs.com/package/ts-writer)
[![JsDelivr](https://data.jsdelivr.com/v1/package/npm/ts-writer/badge?style=rounded)](https://www.jsdelivr.com/package/npm/ts-writer)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/ts-writer/latest?style=flat)](https://bundlephobia.com/package/ts-writer@latest)
[![Packagephobia](https://packagephobia.com/badge?p=ts-writer@latest)](https://packagephobia.com/result?p=ts-writer@latest)

<br />

<div align="center">
  <pre>
  <h1>🖨️<br />TS Writer</h1>
  </pre>
  <br />
</div>

<h3 align="center">
  <code>TS Writer</code> is a simple yet powerful typescript source code writer and collector.
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
- [License](#license)

<br />

## Installing

### Node

```sh
npm install ts-writer # or yarn add ts-writer
```

```js
const { TsWriter } = require('ts-writer');
import { TsWriter } from 'ts-writer';
```

### Browser

```html
<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/ts-writer@latest/dist/index.umd.js"
></script>
```

```js
const { TsWriter } = window.tsWriter;
```

### Url Import

```ts
import { TsWriter } from 'https://cdn.skypack.dev/ts-writer@latest';
```

<br />

## Getting Started

A deferred is nothing more than a promise with `.resolve()` and a `.reject()` method. You
can use it to create a promise that will be resolved or rejected at some point in the
future and, probably, in another scope.

```js
import { TsWriter } from 'ts-writer';

const writer = new TsWriter(require.resolve('../tsconfig.json'));

writer.write`
${{
  // first object is the variables to be used in the template, as well the filename
  filename: 'index.ts',
  property: 'hello',
  deep: {
    property: ['ignore', 'world']
  }
}}

// Type checked and auto-completed!
export const ${'property'} = '${'deep.property.1'}}';

`;

const files = writer.transpile();

files['index.js']; // js code
files['index.ts']; // d.ts code
```

<br />

## License

Licensed under the **MIT**. See [`LICENSE`](LICENSE) for more informations.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_small)

<br />
