import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const avalancheTokensConfig: TokenConfig = {
  [TOKENS.AVAX_WBTC]: {
    address: TOKENS.AVAX_WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: TokenType.Contract,
  },
  [TOKENS.BAVAX_WBTC]: {
    address: TOKENS.BAVAX_WBTC,
    decimals: 18,
    name: 'bWBTC',
    symbol: 'bWTBC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.AVAX_WBTC,
      network: Network.Avalanche,
    },
  },
};
