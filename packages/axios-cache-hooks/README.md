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
  <h1>🪝<br />Axios Cache Hooks</h1>
  </pre>
  <br />
</div>

<h3 align="center">
  <code>Axios Cache Hooks</code> is the faster, simple and efficient way to use Axios inside React applications.
  <br />
  <br />
</h3>

<br />

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installing](#installing)
  - [Url Import](#url-import)
- [Getting Started](#getting-started)
- [How it works](#how-it-works)
- [Compatibility](#compatibility)
- [License](#license)

<br />

## Installing

```sh
npm install axios axios-cache-interceptor axios-cache-hooks
yarn add axios axios-cache-interceptor axios-cache-hooks
```

```js
import { createAxiosHooks } from 'axios-cache-hooks';
const { createAxiosHooks } = require('axios-cache-hooks');
const { hash } = window.axiosCacheHook;
```

```html
<script
  crossorigin
  src="https://cdn.jsdelivr.net/npm/axios-cache-hooks@latest/dist/index.umd.js"
></script>
```

### Url Import

```ts
import { createAxiosHooks } from 'https://cdn.skypack.dev/axios-cache-hooks@latest';
```

<br />

## Getting Started

Object code is a blazing fast hash code generator. It generates unique signed integers for
objects, arrays, functions, symbols and etc.

You can ise it to index object in a collection, compare objects or just generate unique
identifiers.

```ts
// http.ts
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { createAxiosHooks } from 'axios-cache-hooks';

export const axios = setupCache(Axios);

export const { useQuery, useMutation } = createAxiosHooks({
  // This means that the additional configuration will be ALWAYS in the last parameter.
  configParameterIndex: (...params) => params.length - 1
});
```

```ts
// user-api.ts
import { axios } from './http';

/** Simple function that creates an user */
export function getUser(name: string, extraConfig: AxiosRequestConfig): Promise<User> {
  return axios.get<User>('/user/find-by-name', { name }, extraConfig);
}
```

```js
import { getUser } from './user-api';
import { useQuery } from './http';

export const UserAge = ({ username }) => {
  // This will share cache between ALL components that uses the same query and parameters.
  const [user, { loading, error }] = useQuery(getUser, username);

  return <div>{loading ? 'loading...' : user.age}</div>;
};
```

<br />

## How it works

<br />

## Compatibility

See all unique values at [`test/values.ts`](test/values.ts)

This package is always seeking for a faster implementation. This means that we don't
guarantee that the hash will be the same for two different versions of this package. There
will be an warning on the release notes if the hash generation changed.

You shouldn't rely on cross version compatibility, and even if so, you can run some tests
before pushing to production :)

<br />

## License

Licensed under the **MIT**. See [`LICENSE`](LICENSE) for more informations.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_small)

<br />
