import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { TOKENS } from '../../config/constants';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../types/token-config.type';
import { ethTokensConfig } from './eth-tokens.config';

export const bscTokensConfig: TokenConfig = {
  [TOKENS.CAKE]: {
    address: TOKENS.CAKE,
    decimals: 18,
    lookupName: 'pancakeswap-token',
    name: 'Cake',
    symbol: 'CAKE',
    type: TokenType.Contract,
  },
  [TOKENS.WBNB]: {
    address: TOKENS.WBNB,
    decimals: 18,
    lookupName: 'binancecoin',
    name: 'Wrapped Binance Coin',
    symbol: 'WBNB',
    type: TokenType.Contract,
  },
  [TOKENS.BTCB]: {
    address: TOKENS.BTCB,
    decimals: 18,
    lookupName: 'binance-bitcoin',
    name: 'Binance Pegged Bitcoin',
    symbol: 'BTCB',
    type: TokenType.Contract,
  },
  [TOKENS.PANCAKE_BNB_BTCB]: {
    address: TOKENS.PANCAKE_BNB_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: WBNB-BTCB',
    symbol: 'Pancakeswap WBNB/BTCB LP (PLP)',
    type: TokenType.PancakeswapLp,
  },
  [TOKENS.PANCAKE_BBADGER_BTCB]: {
    address: TOKENS.PANCAKE_BBADGER_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BBADGER-BTCB',
    symbol: 'Pancakeswap BBADGER/BTCB LP (PLP)',
    type: TokenType.PancakeswapLp,
  },
  [TOKENS.PANCAKE_BDIGG_BTCB]: {
    address: TOKENS.PANCAKE_BDIGG_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BDIGG-BTCB',
    symbol: 'Pancakeswap BDIGG/BTCB LP (PLP)',
    type: TokenType.PancakeswapLp,
  },
  [TOKENS.BSC_BADGER]: {
    address: TOKENS.BSC_BADGER,
    decimals: 18,
    lookupName: 'badger-dao',
    name: 'Badger',
    symbol: 'BADGER',
    type: TokenType.Contract,
  },
  [TOKENS.BSC_BBADGER]: {
    address: TOKENS.BSC_BBADGER,
    decimals: 18,
    name: 'bBadger',
    symbol: 'bBADGER',
    type: TokenType.Wrapper,
    vaultToken: {
      address: TOKENS.BADGER,
      symbol: ethTokensConfig[TOKENS.BADGER].symbol,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BSC_BDIGG]: {
    address: TOKENS.BSC_BDIGG,
    decimals: 18,
    name: 'bDigg',
    symbol: 'bDIGG',
    type: TokenType.Wrapper,
    vaultToken: {
      address: TOKENS.DIGG,
      symbol: ethTokensConfig[TOKENS.DIGG].symbol,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BPANCAKE_BNB_BTCB]: {
    address: TOKENS.BPANCAKE_BNB_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'bPancakeswap: WBNB-BTCB',
    symbol: 'bPLP-BNB-BTCB',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BNB_BTCB,
      symbol: 'PLP-BNB-BTCB',
      network: ChainNetwork.BinanceSmartChain,
    },
  },
  [TOKENS.BPANCAKE_BBADGER_BTCB]: {
    address: TOKENS.BPANCAKE_BBADGER_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'bPancakeswap: BBADGER-BTCB',
    symbol: 'bPLP-BBADGER-BTCB',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BBADGER_BTCB,
      symbol: 'PLP-BBADGER-BTCB',
      network: ChainNetwork.BinanceSmartChain,
    },
  },
  [TOKENS.BPANCAKE_BDIGG_BTCB]: {
    address: TOKENS.BPANCAKE_BDIGG_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BDIGG-BTCB',
    symbol: 'bPLP-BDIGG-BTCB',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BDIGG_BTCB,
      symbol: 'PLP-BDIGG-BTCB',
      network: ChainNetwork.BinanceSmartChain,
    },
  },
  [TOKENS.BVYWBTC]: {
    address: TOKENS.BVYWBTC,
    decimals: 18,
    name: 'Yearn WBTC',
    symbol: 'bvyWBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.TEST,
      symbol: 'TEST',
      network: ChainNetwork.BinanceSmartChain,
    },
  },
};
