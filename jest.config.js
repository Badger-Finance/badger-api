const nodeEnv = process.env.NODE_ENV || 'test';
process.env.NODE_ENV = nodeEnv;

if (nodeEnv !== 'test' && nodeEnv !== 'ci') {
  throw new Error(`Wrong environment for running tests, should be 'test' or 'ci'. NODE_ENV=${nodeEnv}`);
}

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  resetMocks: true,
  restoreMocks: true,
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  testTimeout: 10000,
  setupFilesAfterEnv: ['./src/test/jest.setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(uuid|ng-dynamic))'],
  coveragePathIgnorePatterns: ['interfaces', 'enums', 'generated', 'chains', 'abi', 'contracts'],
};
