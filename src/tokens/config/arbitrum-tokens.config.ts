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
  [TOKENS.MULTI_RENBTC]: {
    address: TOKENS.MULTI_RENBTC,
    decimals: 8,
    lookupName: 'renbtc',
    name: 'Ren Protocol BTC',
    symbol: 'renBTC',
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
  [TOKENS.ARB_WBTC]: {
    address: TOKENS.ARB_WBTC,
    decimals: 8,
    lookupName: 'bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
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
    name: 'Sushiswap: WETH-SUSHI',
    symbol: 'SLP-WETH-SUSHI',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.ARB_SUSHI_WETH_WBTC]: {
    address: TOKENS.ARB_SUSHI_WETH_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WETH-WBTC',
    symbol: 'SLP-WETH-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.ARB_CRV_RENBTC]: {
    address: TOKENS.ARB_CRV_RENBTC,
    decimals: 18,
    name: 'Curve.fi: renBTC/wBTC',
    symbol: 'crvrenWBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.ARB_CRV_TRICRYPTO]: {
    address: TOKENS.ARB_CRV_TRICRYPTO,
    decimals: 18,
    name: 'Curve.fi Tricrypto',
    symbol: 'crvTricrypto',
    type: TokenType.CurveLP,
  },
  [TOKENS.BARB_SUSHI_WETH_SUSHI]: {
    address: TOKENS.BARB_SUSHI_WETH_SUSHI,
    decimals: 18,
    name: 'bSushiswap: WETH-SUSHI',
    symbol: 'bSLP-WETH-SUSHI',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_SUSHI,
      network: ChainNetwork.Arbitrum,
    },
  },
  [TOKENS.BARB_SUSHI_WETH_WBTC]: {
    address: TOKENS.BARB_SUSHI_WETH_WBTC,
    decimals: 18,
    name: 'bSushiswap: WETH-WBTC',
    symbol: 'bSLP-WETH-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_WBTC,
      network: ChainNetwork.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_RENBTC]: {
    address: TOKENS.BARB_CRV_RENBTC,
    decimals: 18,
    name: 'bCurve.fi wBTC/renBTC',
    symbol: 'bcrvrenBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_RENBTC,
      network: ChainNetwork.Matic,
    },
  },
  [TOKENS.BARB_CRV_TRICRYPTO]: {
    address: TOKENS.BARB_CRV_TRICRYPTO,
    decimals: 18,
    name: 'bCurve.fi Tricrypto',
    symbol: 'bcrvTricrypto',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_RENBTC,
      network: ChainNetwork.Matic,
    },
  },
};
