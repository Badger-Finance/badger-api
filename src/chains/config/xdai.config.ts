import { Network, Protocol } from '@badger-dao/sdk';
import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { xDaiTokensConfig } from '../../tokens/config/xdai-tokens.config';
import { Chain } from './chain.config';
import { BaseStrategy } from '../strategies/base.strategy';

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
      new BaseStrategy(Network.xDai, Object.keys(xDaiTokensConfig)),
      6307200,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }
}

export const xDaiSetts: VaultDefinition[] = [
  {
    name: 'wBTC/wETH',
    vaultToken: TOKENS.BXDAI_SUSHI_WBTC_WETH,
    depositToken: TOKENS.XDAI_SUSHI_WBTC_WETH,

    experimental: true,
    protocol: Protocol.Sushiswap,
    stage: Stage.Staging,
  },
];
