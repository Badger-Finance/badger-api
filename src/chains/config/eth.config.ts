import { Network, Protocol, VaultState } from '@badger-dao/sdk';
import { BLOCKNATIVE_API_KEY } from '../../config/constants';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { getCurveVaultTokenBalance } from '../../protocols/strategies/convex.strategy';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { EthStrategy } from '../strategies/eth.strategy';
import { Chain } from './chain.config';
import axios from 'axios';
import { BlocknativeGasResponse } from '../../gas/interfaces/blocknative-gas-response.interface';

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
      ethSetts,
      rpc[Network.Ethereum],
      new EthStrategy(Object.keys(ethTokensConfig)),
      2425847,
      '0x660802Fc641b154aBA66a62137e71f331B6d787A',
      '0x0A4F4e92C3334821EbB523324D09E321a6B0d8ec',
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
    createdBlock: 11380877,
    depositToken: TOKENS.CRV_SBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_SBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'renBTC/wBTC',
    createdBlock: 11380872,
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_RENBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'tBTC/sBTC',
    createdBlock: 11380878,
    depositToken: TOKENS.CRV_TBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_TBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'renBTC/wBTC',
    createdBlock: 11380939,
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_HRENBTC,
    state: VaultState.Deprecated,
    protocol: Protocol.Curve,
  },
  {
    name: 'wBTC/Badger',
    createdBlock: 11380883,
    depositToken: TOKENS.UNI_BADGER_WBTC,
    vaultToken: TOKENS.BUNI_BADGER_WBTC,
    protocol: Protocol.Uniswap,
    deprecated: true,
  },
  {
    name: 'wBTC/Digg',
    createdBlock: 11680833,
    depositToken: TOKENS.UNI_DIGG_WBTC,
    state: VaultState.Deprecated,
    vaultToken: TOKENS.BUNI_DIGG_WBTC,
    protocol: Protocol.Uniswap,
  },
  {
    name: 'wBTC/wETH',
    createdBlock: 11539529,
    depositToken: TOKENS.SUSHI_ETH_WBTC,
    vaultToken: TOKENS.BSUSHI_ETH_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'wBTC/Badger',
    createdBlock: 11537600,
    depositToken: TOKENS.SUSHI_BADGER_WBTC,
    vaultToken: TOKENS.BSUSHI_BADGER_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'wBTC/Digg',
    createdBlock: 11681030,
    depositToken: TOKENS.SUSHI_DIGG_WBTC,
    vaultToken: TOKENS.BSUSHI_DIGG_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Digg',
    createdBlock: 11680422,
    depositToken: TOKENS.DIGG,
    vaultToken: TOKENS.BDIGG,
  },
  {
    name: 'Badger',
    createdBlock: 11380871,
    depositToken: TOKENS.BADGER,
    vaultToken: TOKENS.BBADGER,
    state: VaultState.Deprecated,
  },
  {
    createdBlock: 12246710,
    name: 'wBTC',
    depositToken: TOKENS.WBTC,
    vaultToken: TOKENS.BVYWBTC,
    protocol: Protocol.Yearn,
  },
  {
    name: 'wBTC/ibBTC',
    createdBlock: 12383984,
    depositToken: TOKENS.SUSHI_IBBTC_WBTC,
    vaultToken: TOKENS.BSUSHI_IBBTC_WBTC,
    strategy: '0xf4146A176b09C664978e03d28d07Db4431525dAd',
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'hBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_HBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_HBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'pBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_PBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_PBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'oBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_OBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_OBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'bBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_BBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_BBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Tricrypto',
    createdBlock: 12679976,
    depositToken: TOKENS.CRV_TRICRYPTO,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_TRICRYPTO,
    state: VaultState.Deprecated,
    protocol: Protocol.Convex,
  },
  {
    name: 'cvxCRV',
    createdBlock: 12678302,
    depositToken: TOKENS.CVXCRV,
    vaultToken: TOKENS.BCVXCRV,
    protocol: Protocol.Convex,
  },
  {
    name: 'CVX',
    createdBlock: 12678302,
    depositToken: TOKENS.CVX,
    vaultToken: TOKENS.BCVX,
    protocol: Protocol.Convex,
  },
  {
    name: 'renBTC',
    createdBlock: 12870265,
    depositToken: TOKENS.RENBTC,
    experimental: true,
    vaultToken: TOKENS.BRENBTC,
    stage: Stage.Staging,
    state: VaultState.Experimental,
  },
  {
    name: 'Tricrypto Boosted',
    createdBlock: 12966048,
    depositToken: TOKENS.CRV_TRICRYPTO2,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_TRICRYPTO2,
    protocol: Protocol.Convex,
  },
  {
    name: 'imBTC',
    createdBlock: 13418026,
    depositToken: TOKENS.IMBTC,
    vaultToken: TOKENS.BIMBTC,
    protocol: Protocol.mStable,
    strategy: '0x10D96b1Fd46Ce7cE092aA905274B8eD9d4585A6E',
  },
  {
    name: 'mhBTC',
    createdBlock: 13418026,
    depositToken: TOKENS.MHBTC,
    vaultToken: TOKENS.BMHBTC,
    protocol: Protocol.mStable,
    strategy: '0x10D96b1Fd46Ce7cE092aA905274B8eD9d4585A6E',
  },
  {
    name: 'Vote Locked CVX',
    createdBlock: 13239091,
    depositToken: TOKENS.CVX,
    vaultToken: TOKENS.BICVX,
    protocol: Protocol.Convex,
  },
  {
    name: 'CVX / Vote Locked CVX',
    createdBlock: 13006329,
    depositToken: TOKENS.CRV_CVXBVECVX,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_CVXBVECVX,
    protocol: Protocol.Curve,
  },
  {
    name: 'ibBTC / crvsBTC LP',
    createdBlock: 13590998,
    depositToken: TOKENS.CRV_IBBTC,
    getTokenBalance: getCurveVaultTokenBalance,
    vaultToken: TOKENS.BCRV_IBBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'MIM / 3CRV',
    createdBlock: 13998331,
    depositToken: TOKENS.CRV_MIM_3CRV,
    getTokenBalance: getCurveVaultTokenBalance,
    newVault: true,
    vaultToken: TOKENS.BCRV_MIM_3CRV,
    state: VaultState.Guarded,
    stage: Stage.Staging,
    protocol: Protocol.Convex,
  },
  {
    name: 'FRAX / 3CRV',
    createdBlock: 13998331,
    depositToken: TOKENS.CRV_FRAX_3CRV,
    getTokenBalance: getCurveVaultTokenBalance,
    newVault: true,
    vaultToken: TOKENS.BCRV_FRAX_3CRV,
    state: VaultState.Guarded,
    stage: Stage.Staging,
    protocol: Protocol.Convex,
  },
];
