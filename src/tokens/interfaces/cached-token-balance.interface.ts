import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { TokenBalance } from './token-balance.interface';

export class CachedTokenBalance {
  @attribute()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  symbol!: string;

  @attribute()
  decimals!: number;

  @attribute()
  balance!: number;

  @attribute()
  valueEth!: number;

  @attribute()
  valueUsd!: number;

  toTokenBalance(currency?: 'usd' | 'eth'): TokenBalance {
    const value = currency && currency === 'eth' ? this.valueEth : this.valueUsd;
    return {
      value,
      address: this.address,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      balance: this.balance,
    };
  }
}
