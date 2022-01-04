import { Network, Protocol, VaultState } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { maticTokensConfig } from '../../tokens/config/matic-tokens.config';
import { Chain } from './chain.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { avalancheTokensConfig } from '../../tokens/config/avax-tokens.config';
import { Stage } from '../../config/enums/stage.enum';

export class Avalanche extends Chain {
  constructor() {
    super(
      'Avalanche',
      'avalanche',
      '0xa86a',
      Network.Avalanche,
      avalancheTokensConfig,
      avalancheSetts,
      rpc[Network.Avalanche],
      new BaseStrategy(Network.Avalanche, Object.keys(maticTokensConfig)),
      10512000,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }

  getBadgerTokenAddress(): string {
    return TOKENS.MATIC_BADGER;
  }
}

export const avalancheSetts: VaultDefinition[] = [
  {
    name: 'WBTC',
    vaultToken: TOKENS.BAVAX_WBTC,
    depositToken: TOKENS.AVAX_WBTC,
    createdBlock: 2749888,
    protocol: Protocol.Aave,
    stage: Stage.Staging,
    state: VaultState.Experimental,
  },
];
