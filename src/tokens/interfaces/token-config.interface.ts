import { Token } from '@badger-dao/sdk';
import { Chain } from '../../chains/config/chain.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { WrappedToken } from './wrapped-token.interface';

export interface TokenConfig {
  [address: string]: {
    getPrice?: (chain: Chain, token: Token) => Promise<TokenPrice>;
    lookupName?: string;
    type: PricingType;
    vaultToken?: WrappedToken;
  };
}
