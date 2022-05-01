module.exports = {
  ...require('../../jest.config'),

  testEnvironment: 'jest-environment-jsdom',
  globalSetup: './test/setup.ts',
  globalTeardown: './test/teardown.ts'
};
