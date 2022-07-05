import { Network, Protocol, VaultState, VaultVersion } from '@badger-dao/sdk';
import axios from 'axios';

import { BLOCKNATIVE_API_KEY } from '../../config/constants';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { BlocknativeGasResponse } from '../../gas/interfaces/blocknative-gas-response.interface';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { getBalancerVaultTokenBalance } from '../../protocols/strategies/balancer.strategy';
import { getCurveVaultTokenBalance } from '../../protocols/strategies/convex.strategy';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
  private readonly client = axios.create({
    baseURL: 'https://api.blocknative.com/gasprices/blockprices',
    headers: { Authorization: BLOCKNATIVE_API_KEY },
  });

  constructor() {
    super(
      'Ethereum',
      'eth',
      '0x01',
      Network.Ethereum,
      ethTokensConfig,
      rpc[Network.Ethereum],
      ethSetts,
      new BaseStrategy(Network.Ethereum, Object.keys(ethTokensConfig)),
      '0x31825c0a6278b89338970e3eb979b05b27faa263',
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    try {
      const { data } = await this.client.get('/');
      const result = data as BlocknativeGasResponse;
      const blockPrices = result.blockPrices[0];
      return {
        rapid: {
          maxPriorityFeePerGas: blockPrices.estimatedPrices[0].maxPriorityFeePerGas,
          maxFeePerGas: blockPrices.estimatedPrices[0].maxFeePerGas,
        },
        fast: {
          maxPriorityFeePerGas: blockPrices.estimatedPrices[1].maxPriorityFeePerGas,
          maxFeePerGas: blockPrices.estimatedPrices[1].maxFeePerGas,
        },
        standard: {
          maxPriorityFeePerGas: blockPrices.estimatedPrices[2].maxPriorityFeePerGas,
          maxFeePerGas: blockPrices.estimatedPrices[2].maxFeePerGas,
        },
        slow: {
          maxPriorityFeePerGas: blockPrices.estimatedPrices[3].maxPriorityFeePerGas,
          maxFeePerGas: blockPrices.estimatedPrices[3].maxFeePerGas,
        },
      };
    } catch (err) {
      return this.defaultGasPrice();
    }
  }
}

export const ethSetts: VaultDefinition[] = [
  {
    name: 'renBTC/wBTC/sBTC',
    depositToken: TOKENS.CRV_SBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_SBTC,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'renBTC/wBTC',
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_RENBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'tBTC/sBTC',
    depositToken: TOKENS.CRV_TBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_TBTC,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'renBTC/wBTC',
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_HRENBTC,
    protocol: Protocol.Curve,
    state: VaultState.Discontinued,
  },
  {
    name: 'wBTC/Badger',
    depositToken: TOKENS.UNI_BADGER_WBTC,
    vaultToken: TOKENS.BUNI_BADGER_WBTC,
    protocol: Protocol.Uniswap,
    state: VaultState.Discontinued,
  },
  {
    name: 'wBTC/Digg',
    depositToken: TOKENS.UNI_DIGG_WBTC,
    vaultToken: TOKENS.BUNI_DIGG_WBTC,
    protocol: Protocol.Uniswap,
    state: VaultState.Discontinued,
  },
  {
    name: 'wBTC/wETH',
    depositToken: TOKENS.SUSHI_ETH_WBTC,
    vaultToken: TOKENS.BSUSHI_ETH_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'wBTC/Badger',
    depositToken: TOKENS.SUSHI_BADGER_WBTC,
    vaultToken: TOKENS.BSUSHI_BADGER_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'wBTC/Digg',
    depositToken: TOKENS.SUSHI_DIGG_WBTC,
    vaultToken: TOKENS.BSUSHI_DIGG_WBTC,
    protocol: Protocol.Sushiswap,
    state: VaultState.Discontinued,
  },
  {
    name: 'Digg',
    depositToken: TOKENS.DIGG,
    vaultToken: TOKENS.BDIGG,
    state: VaultState.Discontinued,
  },
  {
    name: 'Badger',
    depositToken: TOKENS.BADGER,
    vaultToken: TOKENS.BBADGER,
    state: VaultState.Discontinued,
  },
  {
    name: 'wBTC',
    depositToken: TOKENS.WBTC,
    vaultToken: TOKENS.BVYWBTC,
    protocol: Protocol.Yearn,
  },
  {
    name: 'wBTC/ibBTC',
    depositToken: TOKENS.SUSHI_IBBTC_WBTC,
    vaultToken: TOKENS.BSUSHI_IBBTC_WBTC,
    protocol: Protocol.Sushiswap,
    state: VaultState.Discontinued,
  },
  {
    name: 'hBTC',
    depositToken: TOKENS.CRV_HBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_HBTC,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'pBTC',
    depositToken: TOKENS.CRV_PBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_PBTC,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'oBTC',
    depositToken: TOKENS.CRV_OBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_OBTC,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'bBTC',
    depositToken: TOKENS.CRV_BBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_BBTC,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'Tricrypto',
    depositToken: TOKENS.CRV_TRICRYPTO,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_TRICRYPTO,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'cvxCRV',
    depositToken: TOKENS.CVXCRV,
    vaultToken: TOKENS.BCVXCRV,
    protocol: Protocol.Convex,
  },
  {
    name: 'CVX',
    depositToken: TOKENS.CVX,
    vaultToken: TOKENS.BCVX,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'Tricrypto2',
    depositToken: TOKENS.CRV_TRICRYPTO2,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_TRICRYPTO2,
    protocol: Protocol.Convex,
  },
  {
    name: 'imBTC',
    depositToken: TOKENS.IMBTC,
    vaultToken: TOKENS.BIMBTC,
    protocol: Protocol.mStable,
    state: VaultState.Discontinued,
  },
  {
    name: 'mhBTC',
    depositToken: TOKENS.MHBTC,
    vaultToken: TOKENS.BMHBTC,
    protocol: Protocol.mStable,
    state: VaultState.Discontinued,
  },
  {
    name: 'bveCVX',
    depositToken: TOKENS.CVX,
    vaultToken: TOKENS.BVECVX,
    protocol: Protocol.Convex,
  },
  {
    name: 'CVX / bveCVX',
    depositToken: TOKENS.CRV_CVXBVECVX,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_CVXBVECVX,
    protocol: Protocol.Curve,
  },
  {
    name: 'ibBTC / crvsBTC',
    depositToken: TOKENS.CRV_IBBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_IBBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'MIM / 3CRV',
    depositToken: TOKENS.CRV_MIM_3CRV,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_MIM_3CRV,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'FRAX / 3CRV',
    depositToken: TOKENS.CRV_FRAX_3CRV,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_FRAX_3CRV,
    protocol: Protocol.Convex,
    state: VaultState.Discontinued,
  },
  {
    name: 'remBadger',
    depositToken: TOKENS.BADGER,
    vaultToken: TOKENS.BREMBADGER,
    protocol: Protocol.Badger,
  },
  {
    name: 'BADGER / WBTC',
    depositToken: TOKENS.CRV_BADGER,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_BADGER,
    protocol: Protocol.Convex,
  },
  {
    name: 'graviAURA',
    depositToken: TOKENS.AURA,
    vaultToken: TOKENS.GRAVI_AURA,
    protocol: Protocol.Aura,
    state: VaultState.Guarded,
    version: VaultVersion.v1_5,
  },
  {
    name: 'bauraBAL',
    depositToken: TOKENS.AURA_BAL,
    vaultToken: TOKENS.BAURA_BAL,
    protocol: Protocol.Aura,
    state: VaultState.Guarded,
    version: VaultVersion.v1_5,
  },
  {
    name: 'BADGER / WBTC',
    depositToken: TOKENS.BPT_WBTC_BADGER,
    getTokenBalance: getBalancerVaultTokenBalance,
    vaultToken: TOKENS.BBPT_WBTC_BADGER,
    protocol: Protocol.Balancer,
  },
  {
    name: 'BobbaUSD',
    depositToken: TOKENS.BPT_BB_AAVE_USD,
    getTokenBalance: getBalancerVaultTokenBalance,
    vaultToken: TOKENS.BBPT_BB_AAVE_USD,
    protocol: Protocol.Balancer,
  },
];
