import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  coveragePathIgnorePatterns: [
    'index.ts',
    'node_modules',
    'contracts',
    'generated',
    'interfaces',
    'enums',
    'test',
    'patches',
    'models',
    'config',
    'mocks',
    'errors',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
  },
  restoreMocks: true,
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '\\.(ts)$': 'ts-jest',
  },
};

export default config;
