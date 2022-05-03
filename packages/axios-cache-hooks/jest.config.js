module.exports = {
  ...require('../../jest.config'),

  testEnvironment: 'jsdom',
  globalSetup: './test/setup.ts',
  globalTeardown: './test/teardown.ts'
};
