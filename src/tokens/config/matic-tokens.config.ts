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
  [TOKENS.MATIC_USDT]: {
    address: TOKENS.MATIC_USDT,
    decimals: 6,
    lookupName: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    type: TokenType.Contract,
  },
  [TOKENS.MATIC_DAI]: {
    address: TOKENS.MATIC_DAI,
    decimals: 18,
    lookupName: 'dai',
    name: 'Dai',
    symbol: 'DAI',
    type: TokenType.Contract,
  },
  [TOKENS.MATIC_IBBTC]: {
    address: TOKENS.MATIC_IBBTC,
    decimals: 18,
    name: 'ibBTC',
    symbol: 'ibBTC',
    type: TokenType.Index,
  },
  [TOKENS.MATIC_SUSHI_IBBTC_WBTC]: {
    address: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: ibBTC-WBTC',
    symbol: 'SLP-IBBTC-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.MATIC_QUICK_USDC_WBTC]: {
    address: TOKENS.MATIC_QUICK_USDC_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Quickswap: USDC-WBTC',
    symbol: 'QLP-USDC-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.MATIC_CRV_TRICRYPTO]: {
    address: TOKENS.MATIC_CRV_TRICRYPTO,
    decimals: 18,
    name: 'Curve.fi aTricrypto',
    symbol: 'crvaTricrypto',
    type: TokenType.CurveLP,
  },
  [TOKENS.BMATIC_SUSHI_IBBTC_WBTC]: {
    address: TOKENS.BMATIC_SUSHI_IBBTC_WBTC,
    decimals: 18,
    name: 'bSushiSwap: ibBTC-WBTC',
    symbol: 'bSLP-IBBTC-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
      network: ChainNetwork.Matic,
    },
  },
  [TOKENS.BMATIC_QUICK_USDC_WBTC]: {
    address: TOKENS.BMATIC_QUICK_USDC_WBTC,
    decimals: 18,
    name: 'bQuickswap: USDC-WBTC',
    symbol: 'bQLP-USDC-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_QUICK_USDC_WBTC,
      network: ChainNetwork.Matic,
    },
  },
  [TOKENS.BMATIC_CRV_TRICRYPTO]: {
    address: TOKENS.BMATIC_CRV_TRICRYPTO,
    decimals: 18,
    name: 'bCurve.fi USD/BTC/ETH',
    symbol: 'bcrvTricrypto',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_CRV_TRICRYPTO,
      network: ChainNetwork.Ethereum,
    },
  },
};
