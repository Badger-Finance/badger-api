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
    name: 'Sushi ibBTC/WBTC',
    settToken: TOKENS.MATIC_BSUSHI_IBBTC_WBTC,
    depositToken: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
    createdBlock: 17580716,
    experimental: true,
    protocol: Protocol.Sushiswap,
    stage: Stage.Staging,
    strategy: '0x3811448236d4274705b81C6ab99d617bfab617Cd',
  },
];
