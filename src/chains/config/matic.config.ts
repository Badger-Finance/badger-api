import { BADGER_MATIC_URL } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
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
    strategy: '0x3811448236d4274705b81C6ab99d617bfab617Cd',
  },
  {
    name: 'Quickswap Wrapped BTC/USDC',
    settToken: TOKENS.BMATIC_QUICK_USDC_WBTC,
    depositToken: TOKENS.BMATIC_QUICK_USDC_WBTC,
    createdBlock: 17687004,
    experimental: true,
    protocol: Protocol.Quickswap,
    stage: Stage.Staging,
    strategy: '0x809990849D53a5109e0cb9C446137793B9f6f1Eb',
  },
];
