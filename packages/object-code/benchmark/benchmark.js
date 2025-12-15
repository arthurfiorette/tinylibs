/* eslint-disable */

const Benny = require('benny');
const objectHash = require('object-hash');
const objectCode = require('../dist/index.js');

const DUMMY_OBJECT = {
  string: 'some-string',
  number: 34523462346324,
  boolean: true,
  symbol: Symbol('some-symbol'),
  date: new Date(),
  inner: {
    string: 'other-string',
    number: -53867234,
    boolean: false,
    symbol: Symbol(),
    date: new Date(2012, 5, 2)
  },
  array: [
    {
      string: 'array-string',
      number: 2345234,
      boolean: true,
      symbol: Symbol('array-symbol'),
      date: new Date(2020, 1, 1)
    },
    {
      string: 'another-array-string',
      number: -9876543,
      boolean: false,
      symbol: Symbol(),
      date: new Date(1999, 11, 31)
    }
  ]
};

const DUMMY_STRING = JSON.stringify(DUMMY_OBJECT);

Benny.suite(
  'Benchmark (Object)',

  Benny.add('Object Code', () => {
    objectCode.hash(DUMMY_OBJECT);
  }),

  Benny.add('Object Hash', () => {
    objectHash(DUMMY_OBJECT);
  }),

  Benny.cycle(),

  Benny.complete(() => {
    console.log();
  })
);

Benny.suite(
  'Benchmark (Jsonified Object)',

  Benny.add('Object Code', () => {
    objectCode.hash(JSON.stringify(DUMMY_OBJECT));
  }),

  Benny.add('Object Hash', () => {
    objectHash(JSON.stringify(DUMMY_OBJECT));
  }),

  Benny.cycle(),

  Benny.complete(() => {
    console.log();
  })
);

Benny.suite(
  'Benchmark (String)',

  Benny.add('Object Code)', () => {
    objectCode.hash(DUMMY_STRING);
  }),

  Benny.add('Object Hash', () => {
    objectHash(DUMMY_STRING);
  }),

  Benny.cycle(),

  Benny.complete(() => {
    console.log();
  })
);
