import { Network, Protocol, VaultState, VaultVersion } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
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
      rpc[Network.Avalanche],
      avalancheSetts,
      new BaseStrategy(Network.Avalanche, Object.keys(avalancheTokensConfig)),
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }

  // TODO: Update if badger is ever updated
  getBadgerTokenAddress(): string {
    return TOKENS.BADGER;
  }
}

export const avalancheSetts: VaultDefinition[] = [
  {
    name: 'WBTC',
    vaultToken: TOKENS.BAVAX_WBTC,
    depositToken: TOKENS.AVAX_WBTC,
    protocol: Protocol.Aave,
    stage: Stage.Staging,
    state: VaultState.Experimental,
    version: VaultVersion.v1_5,
  },
];
