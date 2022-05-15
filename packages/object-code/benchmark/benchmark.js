/* eslint-disable */

import Benny from 'benny';
import objectHash from 'object-hash';
import * as objectCode from '../dist/index.js';

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
  }
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

  Benny.add('Object Code (Jsonified Object)', () => {
    objectCode.hash(JSON.stringify(DUMMY_OBJECT));
  }),

  Benny.add('Object Hash (Jsonified Object)', () => {
    objectHash(JSON.stringify(DUMMY_OBJECT));
  }),

  Benny.add('Object Code (String)', () => {
    objectCode.hash(DUMMY_STRING);
  }),

  Benny.add('Object Hash (String)', () => {
    objectHash(DUMMY_STRING);
  }),

  Benny.cycle(),

  Benny.complete(() => {
    console.log();
  })
);
