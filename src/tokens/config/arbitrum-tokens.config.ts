import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { TOKENS } from '../../config/tokens.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const arbitrumTokensConfig: TokenConfig = {
  [TOKENS.ARB_BADGER]: {
    address: TOKENS.ARB_BADGER,
    decimals: 18,
    lookupName: 'badger-dao',
    name: 'Badger',
    symbol: 'BADGER',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_WETH]: {
    address: TOKENS.ARB_WETH,
    decimals: 18,
    lookupName: 'ethereum',
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_SUSHI]: {
    address: TOKENS.ARB_SUSHI,
    decimals: 18,
    lookupName: 'sushi',
    name: 'Sushi',
    symbol: 'SUSHI',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_SUSHI_WETH_SUSHI]: {
    address: TOKENS.ARB_SUSHI_WETH_SUSHI,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WBTC-DIGG',
    symbol: 'SLP-WETH-SUSHI',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.BARB_SUSHI_WETH_SUSHI]: {
    address: TOKENS.BARB_SUSHI_WETH_SUSHI,
    decimals: 18,
    name: 'bSushiswap: WBTC-DIGG',
    symbol: 'bSLP-WETH-SUSHI',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_SUSHI,
      network: ChainNetwork.Arbitrum,
    },
  },
};
