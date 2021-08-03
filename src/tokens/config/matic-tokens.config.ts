import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { TOKENS } from '../../config/tokens.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const maticTokensConfig: TokenConfig = {
  [TOKENS.MATIC_WBTC]: {
    address: TOKENS.MATIC_WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: TokenType.Contract,
  },
  [TOKENS.MATIC_USDC]: {
    address: TOKENS.MATIC_USDC,
    decimals: 6,
    lookupName: 'usd-coin',
    name: 'US Dollar Coin',
    symbol: 'USDC',
    type: TokenType.Contract,
  },
  [TOKENS.MATIC_IBBTC]: {
    address: TOKENS.MATIC_IBBTC,
    decimals: 18,
    lookupName: 'ibBTC',
    name: 'Interest-Bearing BTC',
    symbol: 'IBBTC',
    type: TokenType.Contract,
  },
  [TOKENS.MATIC_SUSHI_IBBTC_WBTC]: {
    address: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushi: IBBTC-WBTC',
    symbol: 'SLP-IBBTC-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.MATIC_BSUSHI_IBBTC_WBTC]: {
    address: TOKENS.MATIC_BSUSHI_IBBTC_WBTC,
    decimals: 18,
    name: 'bSushi: IBBTC-WBTC',
    symbol: 'bSLP-IBBTC-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
      network: ChainNetwork.Matic,
    },
  },
};
