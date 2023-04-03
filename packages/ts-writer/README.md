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
  <code>TS Writer</code> is a 1.5Kb template string template engine designated to generate code at runtime.
  <br />
  <br />
</h3>

<br />

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installing](#installing)
  - [Node](#node)
  - [Url Import](#url-import)
- [Getting Started](#getting-started)
- [Template syntax](#template-syntax)
- [Api](#api)
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

```js
const { TsWriter } = window.tsWriter;
```

### Url Import

```ts
import { TsWriter } from 'https://cdn.skypack.dev/ts-writer@latest';
```

<br />

## Getting Started

Ts Writer is a JIC _(Just in Time)_ **template string template engine** designated to
generate typescript code at runtime. It is very simple to use and has a very small
footprint.

There's numerous reasons why code generation increases performance even as javascript is a
JIC interpreted language, this library helps you to generate the code you need at runtime
**in typescript** without having to handle transpiling, multiple files, etc.

Simply create your `TsWriter` instance and you are ready to go!

<br />

## Template syntax

We export you a `t` function that just fills the provided template with your data, it can
be used to other things as well, not just code generation.

The `t` function is a template string tag function, the first argument **MUST** be an
object containing the data you will use in the template. Any other argument is either a
_(deep)_ key of the previous object or an [command](#commands).

```ts
import { t } from 'ts-writer';

t`${{
    some: 'data',
    deep: { property: 'property value' },
    condition: true,
    numbers: [[1], [2], [3], [4], [5]],
    func: () => 'return',
    b: class {
      public num: number = 1;
    }
  }}

(All spaces before the first non-space character gets trimmed out)

Anything inside here already is part of the template.

---

You can use ${'some'} to access the data.
NOTE: You can ONLY pass string properties of the first argument,
you shall use the dot notation to access deeper properties.
${'deep.property'} will access the value 'property value'.

---

You can also use \${['command', ...arguments]} syntax to execute commands.
Currently, there are only 2 commands: if and each.

${['if', 'condition']}
  This will only be in the generated string if the 'condition' property is truthy.
${['/if']}

${['each', 'numbers']}
  This will be repeated for each item in the 'numbers' array.
  You can access the current item with ${'numbers.@'} notation.

  ${['each', 'numbers.@']}
    ${'numbers.@.@'} accesses the current (deep) item.
  ${['/each']}
${['/each']}

---

Everything gets stringified by the 'javascript-stringify' package, so you can
pass everything as a parameter. Like classes and functions!

${'func'} will serialize into '() => "return"'.
and ${'b'} will serialize into 'class { num = 1 }'.

NOTE: Types are not preserved for runtime variables, so you must use this
feature with caution.

(All spaces after the last non-space character gets trimmed out);

`
```

<br />

## Api

Every property is commented in the source code with tsdoc, so you can check it out there.

- `t` - The generic template string template engine function, it does not have any special
  features, it just fills the provided template with your data.

- `Writer` - The main class of the library, it is used to generate code at runtime, its
  nothing more than a `t` wrapper that also calls typescript internally.

- `writer.transpile` - Collects all sources created by `write` and `writeHeader` and
  transpile them to javascript and d.ts files. Returns a `Record<filename, content>`

- `writer.write` - Generates the code to be written in the provided file. The first
  argument is an object with the variables to be used in the template, as well the
  filename. The rest of the arguments are the templates to be written in the file.

- `writer.head` - Generates the code to be written **ON TOP** in the provided file. The
  first argument is an object with the variables to be used in the template, as well the
  filename. The rest of the arguments are the templates to be written in the file.

- `writer.writeUnique` - Generates the code to be written in the provided file **ONLY IF
  NOT ALREADY WRITTEN**. The first argument is an object with the variables to be used in
  the template, as well the filename. The rest of the arguments are the templates to be
  written in the file.

- `writer.headUnique` - Generates the code to be written **ON TOP** in the provided file
  **ONLY IF NOT ALREADY WRITTEN**. The first argument is an object with the variables to
  be used in the template, as well the filename. The rest of the arguments are the
  templates to be written in the file.

<br />

## License

Licensed under the **MIT**. See [`LICENSE`](LICENSE) for more informations.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_small)

<br />
