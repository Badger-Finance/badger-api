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
    symbol: 'sBTCCRV',
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi crvRenWBTC',
    createdBlock: 11380872,
    symbol: 'renBTCCRV',
    depositToken: TOKENS.CRV_RENBTC,
    settToken: TOKENS.BCRV_RENBTC,
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve.fi tBTC/sBTCCrv LP',
    createdBlock: 11380878,
    symbol: 'tBTCCRV',
    depositToken: TOKENS.CRV_TBTC,
    settToken: TOKENS.BCRV_TBTC,
    protocol: Protocol.Curve,
  },
  {
    name: 'Harvest Curve.fi crvRenWBTC',
    createdBlock: 11380939,
    symbol: 'hrenBTCCRV',
    depositToken: TOKENS.CRV_RENBTC,
    settToken: TOKENS.BCRV_HRENBTC,
    protocol: Protocol.Curve,
  },
  {
    name: 'Uniswap Wrapped BTC/Badger',
    createdBlock: 11380883,
    symbol: 'BADGER-WBTC',
    depositToken: TOKENS.UNI_BADGER_WBTC,
    settToken: TOKENS.BUNI_BADGER_WBTC,
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Uniswap Wrapped BTC/Digg',
    createdBlock: 11680833,
    symbol: 'DIGG-WBTC',
    depositToken: TOKENS.UNI_DIGG_WBTC,
    settToken: TOKENS.BUNI_DIGG_WBTC,
    protocol: Protocol.Uniswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Wrapped Ether',
    createdBlock: 11539529,
    symbol: 'SLP-WBTC-ETH',
    depositToken: TOKENS.SUSHI_ETH_WBTC,
    settToken: TOKENS.BSUSHI_ETH_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Badger',
    createdBlock: 11537600,
    symbol: 'SLP-BADGER-WBTC',
    depositToken: TOKENS.SUSHI_BADGER_WBTC,
    settToken: TOKENS.BSUSHI_BADGER_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Sushiswap Wrapped BTC/Digg',
    createdBlock: 11681030,
    symbol: 'SLP-DIGG-WBTC',
    depositToken: TOKENS.SUSHI_DIGG_WBTC,
    settToken: TOKENS.BSUSHI_DIGG_WBTC,
    protocol: Protocol.Sushiswap,
  },
  {
    name: 'Digg',
    createdBlock: 11680422,
    symbol: 'DIGG',
    depositToken: TOKENS.DIGG,
    settToken: TOKENS.BDIGG,
  },
  {
    name: 'Badger',
    createdBlock: 11380871,
    symbol: 'BADGER',
    depositToken: TOKENS.BADGER,
    settToken: TOKENS.BBADGER,
  },
  {
    hasBouncer: true,
    createdBlock: 12246710,
    name: 'Yearn WBTC',
    symbol: 'byvWBTC',
    depositToken: TOKENS.WBTC,
    settToken: TOKENS.BVYWBTC,
    affiliate: {
      protocol: Protocol.Yearn,
    },
  },
  {
    name: 'Sushiswap Wrapped BTC/ibBTC',
    createdBlock: 12383984,
    symbol: 'SLP-IBBTC-WBTC',
    depositToken: TOKENS.SUSHI_IBBTC_WBTC,
    settToken: TOKENS.BSUSHI_IBBTC_WBTC,
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
    symbol: 'ZS-DIGG',
  },
];
