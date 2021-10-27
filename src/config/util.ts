import { ethers } from 'ethers';
import { ContractRegistry } from './interfaces/contract-registry.interface';

export const checksumEntries = (registry: ContractRegistry): ContractRegistry => {
  return Object.fromEntries(Object.entries(registry).map(([key, val]) => [key, ethers.utils.getAddress(val)]));
};
