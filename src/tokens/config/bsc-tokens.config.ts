import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const bscTokensConfig: TokenConfig = {
  [TOKENS.CAKE]: {
    address: TOKENS.CAKE,
    decimals: 18,
    lookupName: 'pancakeswap-token',
    name: 'Cake',
    symbol: 'CAKE',
    type: PricingType.Contract,
  },
  [TOKENS.WBNB]: {
    address: TOKENS.WBNB,
    decimals: 18,
    lookupName: 'binancecoin',
    name: 'Wrapped Binance Coin',
    symbol: 'WBNB',
    type: PricingType.Contract,
  },
  [TOKENS.BTCB]: {
    address: TOKENS.BTCB,
    decimals: 18,
    lookupName: 'binance-bitcoin',
    name: 'Binance Pegged Bitcoin',
    symbol: 'BTCB',
    type: PricingType.Contract,
  },
  [TOKENS.PANCAKE_BNB_BTCB]: {
    address: TOKENS.PANCAKE_BNB_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BNB-BTCB',
    symbol: 'PLP-BNB-BTCB',
    type: PricingType.UniV2LP,
  },
  [TOKENS.PANCAKE_OLD_BNB_BTCB]: {
    address: TOKENS.PANCAKE_OLD_BNB_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BNB-BTCB',
    symbol: 'PLP-BNB-BTCB',
    type: PricingType.UniV2LP,
  },
  [TOKENS.PANCAKE_BBADGER_BTCB]: {
    address: TOKENS.PANCAKE_BBADGER_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BBADGER-BTCB',
    symbol: 'PLP-BBADGER-BTCB',
    type: PricingType.UniV2LP,
  },
  [TOKENS.PANCAKE_BDIGG_BTCB]: {
    address: TOKENS.PANCAKE_BDIGG_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BDIGG-BTCB',
    symbol: 'PLP-BDIGG-BTCB',
    type: PricingType.UniV2LP,
  },
  [TOKENS.MULTI_BADGER]: {
    address: TOKENS.MULTI_BADGER,
    decimals: 18,
    lookupName: 'badger-dao',
    name: 'Badger',
    symbol: 'BADGER',
    type: PricingType.Contract,
  },
  [TOKENS.BSC_BBADGER]: {
    address: TOKENS.BSC_BBADGER,
    decimals: 18,
    name: 'bBadger',
    symbol: 'bBADGER',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BBADGER,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BSC_BDIGG]: {
    address: TOKENS.BSC_BDIGG,
    decimals: 18,
    name: 'bDigg',
    symbol: 'bDIGG',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BDIGG,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BPANCAKE_BNB_BTCB]: {
    address: TOKENS.BPANCAKE_BNB_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'bPancakeswap: WBNB-BTCB',
    symbol: 'bPLP-BNB-BTCB',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BNB_BTCB,
      network: Network.BinanceSmartChain,
    },
  },
  [TOKENS.BPANCAKE_BBADGER_BTCB]: {
    address: TOKENS.BPANCAKE_BBADGER_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'bPancakeswap: BBADGER-BTCB',
    symbol: 'bPLP-BBADGER-BTCB',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BBADGER_BTCB,
      network: Network.BinanceSmartChain,
    },
  },
  [TOKENS.BPANCAKE_BDIGG_BTCB]: {
    address: TOKENS.BPANCAKE_BDIGG_BTCB,
    decimals: 18,
    lpToken: true,
    name: 'Pancakeswap: BDIGG-BTCB',
    symbol: 'bPLP-BDIGG-BTCB',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.PANCAKE_BDIGG_BTCB,
      network: Network.BinanceSmartChain,
    },
  },
};
