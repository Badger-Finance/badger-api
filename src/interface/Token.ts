import { PricingFunction } from '../prices/prices-util';

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isLPToken?: boolean;
  price: PricingFunction;
}
