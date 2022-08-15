module.exports = {
  clearMocks: true,
  coveragePathIgnorePatterns: ["index.ts", "/node_modules/", "/contracts/", "/generated/", "/interfaces/", "/enums/"],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js"
  },
  testEnvironment: "node",
  testRegex: ".spec.ts$",
  transform: {
    "\\.(ts)$": "ts-jest"
  }
};
