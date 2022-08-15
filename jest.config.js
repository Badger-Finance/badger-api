module.exports = {
  clearMocks: true,
  coveragePathIgnorePatterns: ["index.ts", "/node_modules/", "/contracts/", "/generated/", "/interfaces/", "/enums/"],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 50,
      lines: 50,
      statements: 50
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
