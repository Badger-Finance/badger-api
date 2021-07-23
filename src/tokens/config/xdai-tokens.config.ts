import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { TOKENS } from '../../config/tokens.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const xDaiTokensConfig: TokenConfig = {
  [TOKENS.XDAI_WBTC]: {
    address: TOKENS.XDAI_WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: TokenType.Contract,
  },
  [TOKENS.XDAI_WETH]: {
    address: TOKENS.XDAI_WETH,
    decimals: 18,
    lookupName: 'ethereum',
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    type: TokenType.Contract,
  },
  [TOKENS.XDAI_SLP_WBTC_WETH]: {
    address: TOKENS.XDAI_SLP_WBTC_WETH,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: Wrapped BTC-Wrapped Ethereum',
    symbol: 'XDAI-SLP-WBTC-WETH',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.BXDAI_SLP_WBTC_WETH]: {
    address: TOKENS.BXDAI_SLP_WBTC_WETH,
    decimals: 18,
    name: 'bSushiswap: Wrapped BTC-Wrapped Ethereum',
    symbol: 'bXDAI-SLP-WBTC-WETH',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.XDAI_SLP_WBTC_WETH,
      network: ChainNetwork.xDai,
    },
  },
};
