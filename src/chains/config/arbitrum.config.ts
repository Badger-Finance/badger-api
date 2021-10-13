import { Protocol } from '../../config/enums/protocol.enum';
import { SettState } from '../../config/enums/sett-state.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { getCurveSettTokenBalance } from '../../protocols/strategies/convex.strategy';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { arbitrumTokensConfig } from '../../tokens/config/arbitrum-tokens.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { ArbitrumStrategy } from '../strategies/arbitrum.strategy';
import { Chain } from './chain.config';

export class Arbitrum extends Chain {
  constructor() {
    super(
      'Arbitrum',
      'arbitrum',
      '0xa4b1',
      ChainNetwork.Arbitrum,
      arbitrumTokensConfig,
      arbitrumSetts,
      rpc[ChainNetwork.Arbitrum],
      new ArbitrumStrategy(Object.keys(arbitrumTokensConfig)),
      2425847,
      '0x635EB2C39C75954bb53Ebc011BDC6AfAAcE115A6',
      '0x85E1cACAe9a63429394d68Db59E14af74143c61c',
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    const gasPrice = 2;
    return {
      rapid: gasPrice,
      fast: gasPrice,
      standard: gasPrice,
      slow: gasPrice,
    };
  }
}

export const arbitrumSetts: SettDefinition[] = [
  {
    name: 'Sushiswap Wrapped Ether/Sushi Helper',
    settToken: TOKENS.BARB_SUSHI_WETH_SUSHI,
    depositToken: TOKENS.ARB_SUSHI_WETH_SUSHI,
    createdBlock: 13163959,
    protocol: Protocol.Sushiswap,
    strategy: '0x86f772C82914f5bFD168f99e208d0FC2C371e9C2',
  },
  {
    name: 'Sushiswap Wrapped BTC/Wrapped ETH',
    settToken: TOKENS.BARB_SUSHI_WETH_WBTC,
    depositToken: TOKENS.ARB_SUSHI_WETH_WBTC,
    createdBlock: 13163959,
    protocol: Protocol.Sushiswap,
    strategy: '0xA6827f0f14D0B83dB925B616d820434697328c22',
  },
  {
    name: 'Curve renBTC/wBTC',
    settToken: TOKENS.BARB_CRV_RENBTC,
    depositToken: TOKENS.ARB_CRV_RENBTC,
    getTokenBalance: getCurveSettTokenBalance,
    createdBlock: 13237551,
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve Tricrypto',
    settToken: TOKENS.BARB_CRV_TRICRYPTO,
    depositToken: TOKENS.ARB_CRV_TRICRYPTO,
    getTokenBalance: getCurveSettTokenBalance,
    createdBlock: 13237551,
    protocol: Protocol.Curve,
  },
  {
    name: 'Curve Tricrypto Light',
    settToken: TOKENS.BARB_CRV_TRICRYPTO_LITE,
    depositToken: TOKENS.ARB_CRV_TRICRYPTO,
    getTokenBalance: getCurveSettTokenBalance,
    createdBlock: 13321375,
    stage: Stage.Staging,
    state: SettState.Experimental,
    protocol: Protocol.Curve,
  },
  {
    name: 'Swapr Swapr/Wrapped ETH',
    settToken: TOKENS.BARB_SWP_SWPR_WETH,
    depositToken: TOKENS.ARB_SWP_SWPR_WETH,
    createdBlock: 13315350,
    state: SettState.Guarded,
    protocol: Protocol.Swapr,
  },
  {
    name: 'Swapr Wrapped BTC/Wrapped ETH',
    settToken: TOKENS.BARB_SWP_WBTC_WETH,
    depositToken: TOKENS.ARB_SWP_WBTC_WETH,
    createdBlock: 13315350,
    state: SettState.Guarded,
    protocol: Protocol.Swapr,
  },
  {
    name: 'Swapr Badger/Wrapped ETH',
    bouncer: BouncerType.Badger,
    settToken: TOKENS.BARB_SWP_BADGER_WETH,
    depositToken: TOKENS.ARB_SWP_BADGER_WETH,
    createdBlock: 2188169,
    state: SettState.Guarded,
    protocol: Protocol.Swapr,
  },
];
