"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJestEnv = exports.isSlsOffline = exports.getEnvVar = exports.checksumEntries = void 0;
const ethers_1 = require("ethers");
const checksumEntries = (registry) => {
  return Object.fromEntries(Object.entries(registry).map(([key, val]) => [key, ethers_1.ethers.utils.getAddress(val)]));
};
exports.checksumEntries = checksumEntries;
const getEnvVar = (envName) => {
  const variable = process.env[envName];
  if (variable) return variable;
  const errMsg = `Missing required env var: ${envName}`;
  if (isSlsOffline() || isJestEnv()) {
    isSlsOffline() && console.error(errMsg);
    return "Missing value";
  }
  throw new Error(`Missing required env var: ${envName}`);
};
exports.getEnvVar = getEnvVar;
function isSlsOffline() {
  return Boolean(process.env.IS_OFFLINE !== undefined && process.env.IS_OFFLINE === "true");
}
exports.isSlsOffline = isSlsOffline;
function isJestEnv() {
  return process.env.NODE_ENV === "test";
}
exports.isJestEnv = isJestEnv;
//# sourceMappingURL=config.utils.js.map
