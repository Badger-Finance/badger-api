import { BADGER_XDAI_URL } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { xDaiTokensConfig } from '../../tokens/config/xdai-tokens.config';
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
      xDaiTokensConfig,
      xDaiSetts,
      rpc[ChainNetwork.xDai],
      new xDaiStrategy(Object.keys(xDaiTokensConfig)),
      BADGER_XDAI_URL,
      6307200,
    );
    Chain.register(this.network, this);
  }
}

export const xDaiSetts: SettDefinition[] = [
  {
    name: 'Sushiswap Wrapped BTC/Wrapped Ether',
    settToken: TOKENS.BXDAI_SUSHI_WBTC_WETH,
    depositToken: TOKENS.XDAI_SUSHI_WBTC_WETH,
    createdBlock: 17199093,
    experimental: true,
    protocol: Protocol.Sushiswap,
    stage: Stage.Staging,
  },
];
