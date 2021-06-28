import { ethers } from 'ethers';
import { BADGER_URL, Provider, STRATEGIES, TOKENS } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import { getCurveSettTokenBalance } from '../../indexer/strategies/convex.strategy';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { getZsDiggTokenBalance } from '../../tokens/custom/zs-digg-balance';
import { ChainNetwork } from '../enums/chain-network.enum';
import { EthStrategy } from '../strategies/eth.strategy';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
  constructor() {
    super(
      'Ethereum',
      'eth',
      '0x01',
      ChainNetwork.Ethereum,
      ethTokensConfig,
      ethSetts,
      new ethers.providers.JsonRpcProvider(Provider.Alchemy),
      new EthStrategy(),
      BADGER_URL,
      2425847,
    );
    Chain.register(ChainNetwork.Ethereum, this);
  }
}

export const ethSetts: SettDefinition[] = [
  {
    name: 'Curve.fi renBTC/wBTC/sBTC',
    createdBlock: 11380877,
    depositToken: TOKENS.CRV_SBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_SBTC,
    strategy: '0x8cbb86a7e0780a6fbefeec108f9b4b0aa8193e24',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi renBTC/wBTC',
    createdBlock: 11380872,
    depositToken: TOKENS.CRV_RENBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_RENBTC,
    strategy: '0xaa9b716ccd717761f40479cd81f8e3a5a7b4cad7',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi tBTC/sBTC',
    createdBlock: 11380878,
    depositToken: TOKENS.CRV_TBTC,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_TBTC,
    strategy: '0x1ac31c470b90e366c70efc1ac28d5d7fa2f1dbe1',
    protocol: Protocol.Curve,
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
    settToken: TOKENS.BUNI_DIGG_WBTC,
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Wrapped Ether',
    createdBlock: 11539529,
    depositToken: TOKENS.SUSHI_ETH_WBTC,
    strategy: '0x7A56d65254705B4Def63c68488C0182968C452ce',
    settToken: TOKENS.BSUSHI_ETH_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Badger',
    createdBlock: 11537600,
    depositToken: TOKENS.SUSHI_BADGER_WBTC,
    strategy: '0x3a494D79AA78118795daad8AeFF5825C6c8dF7F1',
    settToken: TOKENS.BSUSHI_BADGER_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Digg',
    createdBlock: 11681030,
    depositToken: TOKENS.SUSHI_DIGG_WBTC,
    strategy: '0xaa8dddfe7DFA3C3269f1910d89E4413dD006D08a',
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
    strategy: STRATEGIES.BZS_DIGG,
  },
  {
    name: 'Convex hBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_HBTC,
    experimental: true,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_HBTC,
    strategy: '0xff26f400e57bf726822eacbb64fa1c52f1f27988',
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex pBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_PBTC,
    experimental: true,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_PBTC,
    strategy: '0x1c1fd689103bbfd701b3b7d41a3807f12814033d',
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex oBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_OBTC,
    experimental: true,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_OBTC,
    strategy: '0x2bb864cdb4856ab2d148c5ca52dd7ccec126d138',
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex bBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_BBTC,
    experimental: true,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_BBTC,
    strategy: '0x4f3e7a4566320b2709fd1986f2e9f84053d3e2a0',
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex Tricrypto',
    createdBlock: 12679976,
    depositToken: TOKENS.CRV_TRICRYPTO,
    experimental: true,
    getTokenBalance: getCurveSettTokenBalance,
    settToken: TOKENS.BCRV_TRICRYPTO,
    strategy: '0x05ec4356e1acd89cc2d16adc7415c8c95e736ac1',
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex cvxCRV Helper',
    createdBlock: 12678302,
    depositToken: TOKENS.CVXCRV,
    experimental: true,
    settToken: TOKENS.BCVXCRV,
    strategy: '0x4FE836b28ADc7867290764885b24d3992dAeE819',
    protocol: Protocol.Convex,
  },
  {
    name: 'Convex CVX Helper',
    createdBlock: 12678302,
    depositToken: TOKENS.CVX,
    experimental: true,
    settToken: TOKENS.BCVX,
    strategy: '0x5e7a939f77E5c441e2Ba1Dc8Be5D42020193376D',
    protocol: Protocol.Convex,
  },
];
