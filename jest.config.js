module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["index.ts", "/node_modules/", "/contracts/", "/generated/", "/interfaces/", "/enums/"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  testTimeout: 10000,
  setupFilesAfterEnv: ['./src/test/jest.setup.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  coveragePathIgnorePatterns: ['interfaces', 'enums', 'generated', 'chains', 'abi', 'contracts'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
  },
};
