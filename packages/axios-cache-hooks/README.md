<br />

[![Issues](https://img.shields.io/github/issues/arthurfiorette/tinylibs?logo=github&label=Issues)](https://github.com/arthurfiorette/tinylibs/issues)
[![Stars](https://img.shields.io/github/stars/arthurfiorette/tinylibs?logo=github&label=Stars)](https://github.com/arthurfiorette/tinylibs/stargazers)
[![License](https://img.shields.io/github/license/arthurfiorette/tinylibs?logo=githu&label=License)](https://github.com/arthurfiorette/tinylibs/blob/main/LICENSE)
[![Codecov](https://codecov.io/gh/arthurfiorette/tinylibs/branch/main/graph/badge.svg?token=ML0KGCU0VM)](https://codecov.io/gh/arthurfiorette/tinylibs)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_shield)
[![Join the chat at https://gitter.im/tinylibs-js-org/community](https://badges.gitter.im/tinylibs-js-org/community.svg)](https://gitter.im/tinylibs-js-org/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Speed Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)](https://twitter.com/acdlite/status/974390255393505280)

[![Latest Version](https://img.shields.io/npm/v/axios-cache-hooks)](https://www.npmjs.com/package/axios-cache-hooks)
[![Downloads](https://img.shields.io/npm/dw/axios-cache-hooks)](https://www.npmjs.com/package/axios-cache-hooks)
[![JsDelivr](https://data.jsdelivr.com/v1/package/npm/axios-cache-hooks/badge?style=rounded)](https://www.jsdelivr.com/package/npm/axios-cache-hooks)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/axios-cache-hooks/latest?style=flat)](https://bundlephobia.com/package/axios-cache-hooks@latest)
[![Packagephobia](https://packagephobia.com/badge?p=axios-cache-hooks@latest)](https://packagephobia.com/result?p=axios-cache-hooks@latest)

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
- [Documentation](#documentation)
- [How it works](#how-it-works)
- [Compatibility](#compatibility)
- [License](#license)

<br />

## Installing

```sh
npm   install axios axios-cache-interceptor axios-cache-hooks
yarn  add     axios axios-cache-interceptor axios-cache-hooks
```

```js
import { createAxiosHooks } from 'axios-cache-hooks';
const { createAxiosHooks } = require('axios-cache-hooks');
const { createAxiosHooks } = window.axiosCacheHooks;
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

Axios Cache Hooks is a super effective and performant way to use Axios calls inside React
applications. It is very performant because it deeply uses _(and only works with)_
[Axios](https://axios-http.com) `(6.7Kb)` and
[Axios Cache Interceptor](https://axios-cache-interceptor.js.org/) `(4.2Kb)` under the
hood.

```ts
// http.ts
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { createAxiosHooks } from 'axios-cache-hooks';

export const axios = setupCache(Axios);
export const { useQuery, useMutation } = createAxiosHooks();

/** Returns an user by his name */
export function getUser(name: string, config?: AxiosRequestConfig): Promise<User> {
  return axios.get<User>(`/users/find-by-name/${name}`, config);
}
```

```js
// component.tsx
import { useQuery, getUser } from './http';

export const UserAge = ({ username }) => {
  // This will share cache between ALL components that uses the same query and parameters.
  const [user, { loading, error }] = useQuery(getUser, username);

  return <div>{loading ? 'loading...' : user.age}</div>;
};
```

<br />

## Documentation

This package is so small that every documentation is available in the form of `TSDoc`. You can start by importing `createAxiosHooks` and using the returned hooks.

- [Github](https://github.com/arthurfiorette/tinylibs/tree/main/packages/axios-cache-hooks)
- [Website](https://tinylibs.js.org/packages/axios-cache-hooks)
- [NPM](https://npm.im/axios-cache-hooks)

<br />

## How it works

Basically, this package calls the provided http function on every draw, this is fine
because you can only use this hook with `axios-cache-interceptor` which caches very
effectively axios request, only allowing needed axios request to go through network.

By extracting you request functions into dedicated functions, like the `getUser` above,
you'll enable caching requests at a component level, even for your micro-frontend setup.

This works flawlessly because `Axios Cache Interceptor` has a concept of
[`Request IDs`](https://axios-cache-interceptor.js.org/#/pages/request-id) that defines
which requests are the same or not.

If you still have any questions, please feel free to create an issue and i'll be happy to help (and improve this readme).

<br />

## Compatibility

This package is dependent of `AxiosCacheInterceptor@^0.8` and `Axios@0.28`
[Because of this PR](https://github.com/axios/axios/pull/4659).

<br />

## License

Licensed under the **MIT**. See [`LICENSE`](LICENSE) for more informations.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Farthurfiorette%2Ftinylibs?ref=badge_small)

<br />
