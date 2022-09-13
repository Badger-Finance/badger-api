import { ethers } from 'ethers';

import { ContractRegistry } from './interfaces/contract-registry.interface';

export const checksumEntries = (registry: ContractRegistry): ContractRegistry => {
  return Object.fromEntries(Object.entries(registry).map(([key, val]) => [key, ethers.utils.getAddress(val)]));
};

export const getEnvVar = (envName: string): string => {
  const variable = process.env[envName];

  if (variable) {
    return variable;
  }

  const errMsg = `Missing required env var: ${envName}`;

  if (isSlsOffline() || isJestEnv()) {
    isSlsOffline() && console.error(errMsg);
    return 'Missing value';
  }

  throw new Error(`Missing required env var: ${envName}`);
};

export function isSlsOffline() {
  return Boolean(process.env.IS_OFFLINE !== undefined && process.env.IS_OFFLINE === 'true');
}

export function isJestEnv() {
  return process.env.NODE_ENV === 'test';
}
