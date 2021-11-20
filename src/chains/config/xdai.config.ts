import { Network, Protocol } from '@badger-dao/sdk';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { xDaiTokensConfig } from '../../tokens/config/xdai-tokens.config';
import { xDaiStrategy } from '../strategies/xdai.strategy';
import { Chain } from './chain.config';

export class xDai extends Chain {
  constructor() {
    super(
      'xDai',
      'xdai',
      '0x64',
      Network.xDai,
      xDaiTokensConfig,
      xDaiSetts,
      rpc[Network.xDai],
      new xDaiStrategy(Object.keys(xDaiTokensConfig)),
      6307200,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
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
