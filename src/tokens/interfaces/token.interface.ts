import { Chain } from '../../chains/config/chain.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { WrappedToken } from './wrapped-token.interface';

export interface Token {
  address: string;
  decimals: number;
  getPrice?: (chain: Chain, token: Token) => Promise<TokenPrice>;
  lookupName?: string;
  lpToken?: boolean;
  name: string;
  symbol: string;
  type: PricingType;
  vaultToken?: WrappedToken;
}
