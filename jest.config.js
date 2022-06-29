const nodeEnv = process.env.NODE_ENV || 'test';
const isCiRun = process.env.CI;

process.env.NODE_ENV = nodeEnv;

if (nodeEnv !== 'test' && nodeEnv !== 'ci') {
  throw new Error(`Wrong environment for running tests, should be 'test' or 'ci'. NODE_ENV=${nodeEnv}`);
}

module.exports = () => {
  const extenstions = ['js', 'json'];

  let roots = ['<rootDir>/build/src/', '<rootDir>/build/seed/'];
  let testRegex = '.spec.js$';
  let setupFilesAfterEnv = ['<rootDir>/build/src/test/jest.setup.js'];
  let transform = {};

  if (!isCiRun) {
    roots = ['<rootDir>/src/'];
    extenstions.push('ts');
    testRegex = '.spec.ts$';
    setupFilesAfterEnv = ['<rootDir>/src/test/jest.setup.ts'];
    transform = { '^.+\\.ts$': 'ts-jest' };
  }

  const configObj = {
    rootDir: __dirname,
    roots,
    clearMocks: true,
    moduleFileExtensions: extenstions,
    resetMocks: true,
    restoreMocks: true,
    testEnvironment: 'node',
    testRegex,
    testTimeout: 10000,
    setupFilesAfterEnv,
    transform,
    coveragePathIgnorePatterns: ['interfaces', 'enums', 'generated', 'chains', 'abi', 'contracts'],
  };

  if (isCiRun) configObj.snapshotResolver = '<rootDir>/scripts/snapshotsCiResolver.js';

  return configObj;
};
