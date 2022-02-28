/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.build.json',
      useESM: true
    }
  }
};
