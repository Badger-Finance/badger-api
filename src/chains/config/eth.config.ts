import { Network } from '@badger-dao/sdk';
import fetch from 'node-fetch';
import { BLOCKNATIVE_API_KEY } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { SettState } from '../../config/enums/sett-state.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { getCurveSettTokenBalance } from '../../protocols/strategies/convex.strategy';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { getZsDiggTokenBalance } from '../../tokens/custom/zs-digg-balance';
import { EthStrategy } from '../strategies/eth.strategy';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
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
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    const prices = await fetch('https://api.blocknative.com/gasprices/blockprices', {
      headers: { Authorization: BLOCKNATIVE_API_KEY },
    });
    const result = await prices.json();
    const blockPrices = result.blockPrices[0];
    return {
      rapid: {
        maxFeePerGas: blockPrices.estimatedPrices[0].maxFeePerGas,
        maxPriorityFeePerGas: blockPrices.estimatedPrices[0].maxPriorityFeePerGas,
      },
      fast: {
        maxFeePerGas: blockPrices.estimatedPrices[1].maxFeePerGas,
        maxPriorityFeePerGas: blockPrices.estimatedPrices[1].maxPriorityFeePerGas,
      },
      standard: {
        maxFeePerGas: blockPrices.estimatedPrices[2].maxFeePerGas,
        maxPriorityFeePerGas: blockPrices.estimatedPrices[2].maxPriorityFeePerGas,
      },
      slow: {
        maxFeePerGas: blockPrices.estimatedPrices[3].maxFeePerGas,
        maxPriorityFeePerGas: blockPrices.estimatedPrices[3].maxPriorityFeePerGas,
      },
    };
  }
}

export const ethSetts: SettDefinition[] = [
  {
    name: 'Convex renBTC/wBTC/sBTC',
    createdBlock: 11380877,
    depositToken: TOKENS.CRV_SBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_SBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex renBTC/wBTC',
    createdBlock: 11380872,
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_RENBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex tBTC/sBTC',
    createdBlock: 11380878,
    depositToken: TOKENS.CRV_TBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_TBTC,
    protocol: Protocol.Convex,
  },
  // TODO: Remove once fully deprecated
  {
    name: 'Harvest renBTC/wBTC',
    createdBlock: 11380939,
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_HRENBTC,
    protocol: Protocol.Curve,
  },
  {
    name: 'Uniswap Wrapped BTC/Badger',
    createdBlock: 11380883,
    depositToken: TOKENS.UNI_BADGER_WBTC,
    settToken: TOKENS.BUNI_BADGER_WBTC,
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Uniswap Wrapped BTC/Digg',
    createdBlock: 11680833,
    depositToken: TOKENS.UNI_DIGG_WBTC,
    deprecated: true,
    settToken: TOKENS.BUNI_DIGG_WBTC,
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Wrapped ETH',
    createdBlock: 11539529,
    depositToken: TOKENS.SUSHI_ETH_WBTC,
    settToken: TOKENS.BSUSHI_ETH_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Badger',
    createdBlock: 11537600,
    depositToken: TOKENS.SUSHI_BADGER_WBTC,
    settToken: TOKENS.BSUSHI_BADGER_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Digg',
    createdBlock: 11681030,
    depositToken: TOKENS.SUSHI_DIGG_WBTC,
    settToken: TOKENS.BSUSHI_DIGG_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Digg',
    createdBlock: 11680422,
    depositToken: TOKENS.DIGG,
    settToken: TOKENS.BDIGG,
  },
  {
    name: 'Badger',
    createdBlock: 11380871,
    deprecated: true,
    depositToken: TOKENS.BADGER,
    settToken: TOKENS.BBADGER,
  },
  {
    createdBlock: 12246710,
    name: 'Yearn Wrapped BTC',
    depositToken: TOKENS.WBTC,
    settToken: TOKENS.BVYWBTC,
  },
  {
    name: 'Sushiswap Wrapped BTC/ibBTC',
    createdBlock: 12383984,
    depositToken: TOKENS.SUSHI_IBBTC_WBTC,
    settToken: TOKENS.BSUSHI_IBBTC_WBTC,
    strategy: '0xf4146A176b09C664978e03d28d07Db4431525dAd',
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Digg Stabilization',
    balanceDecimals: 18,
    createdBlock: 12375910,
    depositToken: TOKENS.DIGG,
    experimental: true,
    getTokenBalance: getZsDiggTokenBalance,
    protocol: Protocol.Badger,
    settToken: TOKENS.BZS_DIGG,
    stage: Stage.Staging,
    state: SettState.Experimental,
  },
  {
    name: 'Convex hBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_HBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_HBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex pBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_PBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_PBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex oBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_OBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_OBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex bBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_BBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_BBTC,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex Tricrypto',
    createdBlock: 12679976,
    depositToken: TOKENS.CRV_TRICRYPTO,
    deprecated: true,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_TRICRYPTO,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex cvxCRV Helper',
    createdBlock: 12678302,
    depositToken: TOKENS.CVXCRV,
    settToken: TOKENS.BCVXCRV,
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex CVX Helper',
    createdBlock: 12678302,
    depositToken: TOKENS.CVX,
    settToken: TOKENS.BCVX,
    protocol: Protocol.Convex,
  },
  {
    name: 'renBTC',
    createdBlock: 12870265,
    depositToken: TOKENS.RENBTC,
    experimental: true,
    settToken: TOKENS.BRENBTC,
    stage: Stage.Staging,
    state: SettState.Experimental,
  },
  {
    name: 'Convex Tricrypto2',
    createdBlock: 12966048,
    depositToken: TOKENS.CRV_TRICRYPTO2,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_TRICRYPTO2,
    protocol: Protocol.Convex,
  },
  {
    name: 'mStable imBTC',
    createdBlock: 13418026,
    depositToken: TOKENS.IMBTC,
    settToken: TOKENS.BIMBTC,
    protocol: Protocol.mStable,
    strategy: '0x10D96b1Fd46Ce7cE092aA905274B8eD9d4585A6E',
  },
  {
    name: 'mStable mhBTC',
    createdBlock: 13418026,
    depositToken: TOKENS.MHBTC,
    settToken: TOKENS.BMHBTC,
    protocol: Protocol.mStable,
    strategy: '0x10D96b1Fd46Ce7cE092aA905274B8eD9d4585A6E',
  },
  {
    name: 'Convex Vote Locked CVX',
    createdBlock: 13239091,
    depositToken: TOKENS.CVX,
    settToken: TOKENS.BICVX,
    protocol: Protocol.Convex,
  },
  {
    name: 'Curve.fi CVX / Vote Locked CVX',
    createdBlock: 13006329,
    depositToken: TOKENS.CRV_CVXBVECVX,
    getTokenBalance: getCurveSettTokenBalance,
    stage: Stage.Staging,
    settToken: TOKENS.BCRV_CVXBVECVX,
    protocol: Protocol.Curve,
  },
];
