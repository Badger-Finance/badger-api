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
    name: 'Quickswap WBTC/USDC',
    settToken: TOKENS.BQUICK_WBTC_USDC,
    depositToken: TOKENS.QUICK_WBTC_USDC,
    createdBlock: 17034232,
    experimental: true,
    protocol: Protocol.Quickswap,
    stage: Stage.Staging,
  },
];
