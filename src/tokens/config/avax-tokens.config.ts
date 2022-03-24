import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const avalancheTokensConfig: TokenConfig = {
  [TOKENS.AVAX_WBTC]: {
    lookupName: 'wrapped-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.AVAX_WAVAX]: {
    lookupName: 'wrapped-avax',
    type: PricingType.LookupName,
  },
  [TOKENS.BAVAX_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.AVAX_WBTC,
      network: Network.Avalanche,
    },
  },
};
