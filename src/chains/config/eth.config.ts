import { ethers } from 'ethers';
import { BADGER_URL, Provider, STRATEGIES, TOKENS } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
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
    settToken: TOKENS.BCRV_SBTC,
    strategy: '0x8cbb86a7e0780a6fbefeec108f9b4b0aa8193e24',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi renBTC/wBTC',
    createdBlock: 11380872,
    depositToken: TOKENS.CRV_RENBTC,
    settToken: TOKENS.BCRV_RENBTC,
    strategy: '0xaa9b716ccd717761f40479cd81f8e3a5a7b4cad7',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi tBTC/sBTC',
    createdBlock: 11380878,
    depositToken: TOKENS.CRV_TBTC,
    settToken: TOKENS.BCRV_TBTC,
    strategy: '0x1ac31c470b90e366c70efc1ac28d5d7fa2f1dbe1',
    protocol: Protocol.Curve,
  },
  // TODO: Remove once fully deprecated
  {
    name: 'Harvest-Curve.fi renBTC/wBTC',
    createdBlock: 11380939,
    depositToken: TOKENS.CRV_RENBTC,
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
    hasBouncer: true,
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
    name: 'Curve.fi hBTC/wBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_HBTC,
    experimental: true,
    hasBouncer: true,
    settToken: TOKENS.BCRV_HBTC,
    stage: Stage.Staging,
    strategy: '0xca4b98ca964713287a36224364dbed15c9b7abc3',
    protocol: Protocol.Convex,
  },
  {
    name: 'Curve.fi pBTC/wBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_PBTC,
    experimental: true,
    hasBouncer: true,
    settToken: TOKENS.BCRV_PBTC,
    stage: Stage.Staging,
    strategy: '0xcaed73bcdd45d2469b1287a7c21d7a31b2bb7b35',
    protocol: Protocol.Convex,
  },
  {
    name: 'Curve.fi oBTC/wBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_OBTC,
    experimental: true,
    hasBouncer: true,
    settToken: TOKENS.BCRV_OBTC,
    stage: Stage.Staging,
    strategy: '0xdbda6fa60c48a7da8e0c7ae25a20fd089c0f6a1f',
    protocol: Protocol.Convex,
  },
  {
    name: 'Curve.fi bBTC/wBTC',
    createdBlock: 12589485,
    depositToken: TOKENS.CRV_RENBTC,
    experimental: true,
    hasBouncer: true,
    settToken: TOKENS.BCRV_BBTC,
    stage: Stage.Staging,
    strategy: '0x353200ed9f63fa7804816b336d50e9f0d7c88d2c',
    protocol: Protocol.Convex,
  },
];
