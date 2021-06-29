import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import createMockInstance from 'jest-create-mock-instance';
import { inCurrency } from '../prices/prices.utils';
import { Token } from '../tokens/interfaces/token.interface';
import { TokenBalance } from '../tokens/interfaces/token-balance.interface';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';

/* eslint-disable @typescript-eslint/ban-ts-comment */
export const setupMapper = (items: unknown[], filter?: (items: unknown[]) => unknown[]) => {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  let result = items;
  if (filter) {
    result = filter(items);
  }
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => result.values());
  return jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => qi);
};
/* eslint-enable @typescript-eslint/ban-ts-comment */

export const randomValue = (min?: number, max?: number): number => {
  const minPrice = min || 10;
  const maxPrice = max || 50000;
  return minPrice + Math.random() * (maxPrice - minPrice);
};

export function toTestBalance(token: Token, balance: number, currency?: string): TokenBalance {
  const price = parseInt(token.address.slice(0, 4), 16);
  const tokenPrice: TokenPrice = {
    name: token.name,
    address: token.address,
    usd: price,
    eth: price,
  };
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * inCurrency(tokenPrice, currency),
  };
}
