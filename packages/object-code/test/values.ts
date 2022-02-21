/* eslint-disable */
/* istanbul ignore file */

import { serialize } from '../src';

/** All values in this array MUST return an different hashcode. */
export const values = [
  // Symbols
  Symbol(),
  Symbol(123),
  Symbol('asd'),

  // strings
  '',
  "''",
  'null',
  "'null'",
  'false',
  "'false'",
  'some-string',
  'true',
  "'true'",
  '0',
  "'0'",
  '1',
  "'1'",
  'void 0',
  "'void 0'",
  'undefined',
  "'undefined'",

  // Literals
  null,
  false,
  -123,
  true,
  -Infinity,
  NaN,
  0,
  void 0, // undefined
  1,
  Infinity,
  3479865453234234234234234287654246345634563454523452345e252,
  -3479865453234234234234234287654246345634563454523452345e252,

  // Functions

  { a: function () {} },
  { b: function () {} },
  { b: function (_b: any) {} },
  function (_c: any) {},
  function (_b: any) {},
  function (a: any) {
    return a;
  },
  function (b: any) {
    return b;
  },
  function withName() {},
  function () {},
  { lambda: () => {} },
  { lam2da: () => {} },

  // Objects

  { a: 1, b: 2 },
  { a: 'asd1', b: 'asd1' },
  { a: 'asd1', b: 'asd' },
  '{"a":"asd","b":"asd"}',
  {},
  { a: {}, b: {} },
  {
    valueOf() {
      return 1;
    }
  },
  {
    valueOf() {
      return 2;
    }
  },
  {
    valueOf: () => 2
  },
  {
    valueOf: () => {
      return 2;
    }
  },
  { url: 12 },
  { headers: 12 },
  { headers: 122 },
  { headers: '122' },
  { headers: { accept: 'text/plain' } },
  { payload: [0, 1, 2, 3], headers: [{ a: 'b' }] },

  // Arrays
  [],
  [{ a: 1 }, 123],
  [0, 1, 2, 3],
  [1, 23, 4],
  [1, 2],
  [2, 1],
  { 0: 0, 1: 1, 2: 2, 3: 3 },
  { 0: 0, 1: 1, 2: 2, 3: 3, length: 4 },
  { 0: 0, 1: 1, 2: 2, 3: 3, length: 5 },

  // Dates
  new Date(),
  new Date(2019, 5, 28),
  new Date(1988, 5, 9),

  // Regex
  /some-regex/,
  /other-regex/,

  // Classes
  class {
    a = 1;
  },
  class {},
  class Asd {},
  new (class {
    a = 1;
  })(),
  new (class {})(),
  new (class Asd {})(),

  //@ts-expect-error
  new (function () {})(),
  //@ts-expect-error
  new (function (this: any) {
    this.a = 1;
  })(),
  //@ts-expect-error
  new (function () {
    //@ts-expect-error
    const a = 1;
  })(),
  //@ts-expect-error
  new (function Asd() {})(),

  // Bigint
  BigInt('9007199254740991'),
  9007199254740991
];

// Also adds its own serialized versions
for (const val of [...values]) {
  values.push(serialize(val));
}
