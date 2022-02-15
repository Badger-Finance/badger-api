import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const xDaiTokensConfig: TokenConfig = {
  [TOKENS.XDAI_WBTC]: {
    address: TOKENS.XDAI_WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: PricingType.LookupName,
  },
  [TOKENS.XDAI_WETH]: {
    address: TOKENS.XDAI_WETH,
    decimals: 18,
    lookupName: 'ethereum',
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    type: PricingType.LookupName,
  },
  [TOKENS.XDAI_SUSHI_WBTC_WETH]: {
    address: TOKENS.XDAI_SUSHI_WBTC_WETH,
    decimals: 18,
    lpToken: true,
    name: 'SushiSwap: WBTC-ETH',
    symbol: 'SLP-WBTC-ETH',
    type: PricingType.UniV2LP,
  },
  [TOKENS.BXDAI_SUSHI_WBTC_WETH]: {
    address: TOKENS.BXDAI_SUSHI_WBTC_WETH,
    decimals: 18,
    name: 'bSushiSwap: WBTC-ETH',
    symbol: 'bSLP-WBTC-ETH',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.XDAI_SUSHI_WBTC_WETH,
      network: Network.xDai,
    },
  },
};
