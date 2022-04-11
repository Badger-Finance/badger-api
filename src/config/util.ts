import { ethers } from 'ethers';
import { ContractRegistry } from './interfaces/contract-registry.interface';
import { ENV_VARS } from './constants';
export const checksumEntries = (registry: ContractRegistry): ContractRegistry => {
  return Object.fromEntries(Object.entries(registry).map(([key, val]) => [key, ethers.utils.getAddress(val)]));
};

export const getEnvVar = (envName: string): string => {
  const variable = process.env[envName];
  if (variable) {
    return variable;
  } else {
    throw new Error(`Missing required env var: ${envName}`);
  }
};

export const loadEnvVariables = (): void => {
  ENV_VARS.forEach((envVar) => {
    try {
      getEnvVar(envVar);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
};
