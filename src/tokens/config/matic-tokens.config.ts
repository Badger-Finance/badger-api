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
  [TOKENS.QUICK_WBTC_USDC]: {
    address: TOKENS.QUICK_WBTC_USDC,
    decimals: 18,
    lpToken: true,
    name: 'Quickswap: WBTC-USDC',
    symbol: 'QLP-BADGER-USDC',
    type: TokenType.QuickswapLp,
  },
  [TOKENS.BQUICK_WBTC_USDC]: {
    address: TOKENS.BQUICK_WBTC_USDC,
    decimals: 18,
    name: 'bQuickswap: WBTC-USDC',
    symbol: 'bQLP-BADGER-USDC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.QUICK_WBTC_USDC,
      network: ChainNetwork.Matic,
    },
  },
};
