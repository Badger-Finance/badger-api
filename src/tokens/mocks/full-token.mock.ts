import { Network } from '@badger-dao/sdk';

import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenFullMap } from '../interfaces/token-full.interface';

export const fullTokenMockMap: TokenFullMap = {
  [TOKENS.BADGER]: {
    address: TOKENS.BADGER,
    decimals: 18,
    name: 'Badger',
    symbol: 'BADGER',
    lookupName: 'badger-dao',
    type: PricingType.LookupName,
  },
  [TOKENS.DIGG]: {
    address: TOKENS.DIGG,
    decimals: 9,
    name: 'Digg',
    symbol: 'DIGG',
    type: PricingType.Contract,
  },
  [TOKENS.WBTC]: {
    address: TOKENS.WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: PricingType.LookupName,
  },
  [TOKENS.WETH]: {
    address: TOKENS.WETH,
    decimals: 18,
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    type: PricingType.Contract,
  },
  [TOKENS.BBADGER]: {
    address: TOKENS.BBADGER,
    decimals: 18,
    name: 'bBadger',
    symbol: 'bBADGER',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BADGER,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BDIGG]: {
    address: TOKENS.BDIGG,
    decimals: 18,
    name: 'bDigg',
    symbol: 'bDIGG',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.DIGG,
      network: Network.Ethereum,
    },
  },
  [TOKENS.CVX]: {
    address: TOKENS.CVX,
    decimals: 18,
    name: 'Convex Token',
    symbol: 'CVX',
    type: PricingType.Contract,
  },
  [TOKENS.BCVXCRV]: {
    address: TOKENS.BCVXCRV,
    decimals: 18,
    name: 'bCVXCRV',
    symbol: 'bCVXCRV',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CVXCRV,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BVECVX]: {
    address: TOKENS.BVECVX,
    decimals: 18,
    name: 'bVECVX',
    symbol: 'bVECVX',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CVX,
      network: Network.Ethereum,
    },
  },
};
