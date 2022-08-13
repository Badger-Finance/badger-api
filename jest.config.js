module.exports = {
  clearMocks: true,
  coveragePathIgnorePatterns: ["index.ts", "/node_modules/", "/contracts/", "/generated/", "/interfaces/", "/enums/"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
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