import { BigNumber, ethers } from 'ethers';
import { ChainNetwork } from '../chains/enums/chain-network.enum';

export interface EventInput {
  asset: string;
  createdBlock: number;
  contract: string;
  chain?: ChainNetwork;
  source?: string;
  pathParameters?: Record<string, string>;
  queryStringParameters?: Record<string, string>;
}

const blockToHour = (value: number) => value * 276;
export const blockToDay = (value: number) => blockToHour(value) * 24;
const secondToHour = (value: number) => value * 3600;
export const secondToDay = (value: number) => secondToHour(value) * 24;
export const toRate = (value: number, duration: number) => (duration !== 0 ? value / duration : value);

export const successfulCapture = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const toFloat = (balance: BigNumber, decimals: number): number => {
  return parseFloat(ethers.utils.formatUnits(balance, decimals));
};
