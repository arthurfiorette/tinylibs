module.exports = {
  ...require('../../jest.config'),

  testEnvironment: 'node',
  globalSetup: './test/setup.ts',
  globalTeardown: './test/teardown.ts'
};
