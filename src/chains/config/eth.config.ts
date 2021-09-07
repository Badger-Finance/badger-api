import { BADGER_URL, STRATEGIES } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { SettState } from '../../config/enums/sett-state.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { getCurveSettTokenBalance } from '../../protocols/strategies/convex.strategy';
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
      rpc[ChainNetwork.Ethereum],
      new EthStrategy(Object.keys(ethTokensConfig)),
      BADGER_URL,
      2425847,
      '0xbe82A3259ce427B8bCb54b938b486dC2aF509Cc3',
      '0x0A4F4e92C3334821EbB523324D09E321a6B0d8ec',
    );
    Chain.register(this.network, this);
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
    state: SettState.Experimental,
    strategy: STRATEGIES.BZS_DIGG,
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
    createdBlock: 12834526,
    depositToken: TOKENS.IMBTC,
    settToken: TOKENS.BIMBTC,
    protocol: Protocol.mStable,
    stage: Stage.Staging,
    state: SettState.Experimental,
    strategy: '0x10D96b1Fd46Ce7cE092aA905274B8eD9d4585A6E',
  },
  {
    name: 'mStable mhBTC',
    createdBlock: 12834526,
    depositToken: TOKENS.MHBTC,
    settToken: TOKENS.BMHBTC,
    protocol: Protocol.mStable,
    stage: Stage.Staging,
    state: SettState.Experimental,
    strategy: '0x10D96b1Fd46Ce7cE092aA905274B8eD9d4585A6E',
  },
  {
    name: 'Convex Vote Locked CVX',
    createdBlock: 13153663,
    depositToken: TOKENS.CVX,
    settToken: TOKENS.BICVX,
    stage: Stage.Staging,
    state: SettState.Experimental,
    protocol: Protocol.Convex,
    strategy: '0xE096ccEc4a1D36F191189Fe61E803d8B2044DFC3',
  },
];
