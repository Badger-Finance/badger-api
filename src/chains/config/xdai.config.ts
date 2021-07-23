import { BADGER_XDAI_URL } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { ChainNetwork } from '../enums/chain-network.enum';
import { xDaiStrategy } from '../strategies/xdai.strategy';
import { Chain } from './chain.config';

export class xDai extends Chain {
  constructor() {
    super(
      'xDai',
      'xdai',
      '0x64',
      ChainNetwork.xDai,
      {},
      xDaiSetts,
      rpc[ChainNetwork.xDai],
      new xDaiStrategy(),
      BADGER_XDAI_URL,
      15768000,
    );
    Chain.register(this.network, this);
  }
}

export const xDaiSetts: SettDefinition[] = [
  {
    name: 'Sushiswap WBTC/WETH',
    settToken: TOKENS.BXDAI_SLP_WBTC_WETH,
    depositToken: TOKENS.XDAI_SLP_WBTC_WETH,
    createdBlock: 17034232,
    experimental: true,
    protocol: Protocol.Quickswap,
    stage: Stage.Staging,
  },
];
