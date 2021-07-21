import { ethers } from 'ethers';
import { ContractRegistry } from './interfaces/contract-registry.interface';

export const successfulCapture = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const checksumEntries = (registry: ContractRegistry): ContractRegistry => {
  return Object.fromEntries(Object.entries(registry).map(([key, val]) => [key, ethers.utils.getAddress(val)]));
};
