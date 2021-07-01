import { ethers } from 'ethers';
import { ContractRegistry } from './interfaces/contract-registry.interface';

const blockToHour = (value: number) => value * 276;
export const blockToDay = (value: number) => blockToHour(value) * 24;
const secondToHour = (value: number) => value * 3600;
export const secondToDay = (value: number) => secondToHour(value) * 24;
export const toRate = (value: number, duration: number) => (duration !== 0 ? value / duration : value);

export const successfulCapture = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const checksumEntries = (registry: ContractRegistry): ContractRegistry => {
  return Object.fromEntries(Object.entries(registry).map(([key, val]) => [key, ethers.utils.getAddress(val)]));
};
