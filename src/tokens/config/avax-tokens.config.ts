import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const avalancheTokensConfig: TokenConfig = {
  [TOKENS.AVAX_WBTC]: {
    address: TOKENS.AVAX_WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: PricingType.LookupName,
  },
  [TOKENS.AVAX_WAVAX]: {
    address: TOKENS.AVAX_WAVAX,
    decimals: 18,
    lookupName: 'wrapped-avax',
    name: 'Wrapped Avalanche',
    symbol: 'WAVAX',
    type: PricingType.LookupName,
  },
  [TOKENS.BAVAX_WBTC]: {
    address: TOKENS.BAVAX_WBTC,
    decimals: 18,
    name: 'bWBTC',
    symbol: 'bWBTC',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.AVAX_WBTC,
      network: Network.Avalanche,
    },
  },
};
