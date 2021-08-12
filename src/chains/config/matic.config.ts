import { BADGER_MATIC_URL } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { getCurveSettTokenBalance } from '../../protocols/strategies/convex.strategy';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { maticTokensConfig } from '../../tokens/config/matic-tokens.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { MaticStrategy } from '../strategies/matic.strategy';
import { Chain } from './chain.config';

export class Polygon extends Chain {
  constructor() {
    super(
      'Polygon',
      'matic',
      '0x89',
      ChainNetwork.Matic,
      maticTokensConfig,
      maticSetts,
      rpc[ChainNetwork.Matic],
      new MaticStrategy(),
      BADGER_MATIC_URL,
      15768000,
    );
    Chain.register(this.network, this);
  }
}

export const maticSetts: SettDefinition[] = [
  {
    name: 'Sushiswap Wrapped BTC/ibBTC',
    settToken: TOKENS.BMATIC_SUSHI_IBBTC_WBTC,
    depositToken: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
    createdBlock: 17580716,
    experimental: true,
    protocol: Protocol.Sushiswap,
    stage: Stage.Staging,
    strategy: '0xDed61Bd8a8c90596D8A6Cf0e678dA04036146963',
  },
  {
    name: 'Quickswap Wrapped BTC/USDC',
    settToken: TOKENS.BMATIC_QUICK_USDC_WBTC,
    depositToken: TOKENS.MATIC_QUICK_USDC_WBTC,
    createdBlock: 17687004,
    experimental: true,
    protocol: Protocol.Quickswap,
    stage: Stage.Staging,
    strategy: '0x809990849D53a5109e0cb9C446137793B9f6f1Eb',
  },
  {
    name: 'Curve aTricrypto',
    settToken: TOKENS.BMATIC_CRV_TRICRYPTO,
    depositToken: TOKENS.MATIC_CRV_TRICRYPTO,
    getTokenBalance: getCurveSettTokenBalance,
    createdBlock: 17615233,
    experimental: true,
    protocol: Protocol.Curve,
    stage: Stage.Staging,
    strategy: '0xDb0C3118ef1acA6125200139BEaCc5D675F37c9C',
  },
  {
    name: 'Curve Ren',
    settToken: TOKENS.BMATIC_CRV_AMWBTC,
    depositToken: TOKENS.MATIC_CRV_AMWBTC,
    getTokenBalance: getCurveSettTokenBalance,
    createdBlock: 17616741,
    experimental: true,
    protocol: Protocol.Curve,
    stage: Stage.Staging,
    strategy: '0xF8F02D0d41C79a1973f65A440C98acAc7eAA8Dc1',
  },
];
