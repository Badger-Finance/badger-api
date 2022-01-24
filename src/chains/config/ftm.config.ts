import { Network } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { Chain } from './chain.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { ONE_YEAR_SECONDS } from '../../config/constants';
import { fantomTokensConfig } from '../../tokens/config/ftm-tokens.config';

export class Fantom extends Chain {
  constructor() {
    super(
      'Fantom',
      'fantom',
      '0xFA',
      Network.Fantom,
      fantomTokensConfig,
      fantomSetts,
      rpc[Network.Fantom],
      new BaseStrategy(Network.Fantom, Object.keys(fantomTokensConfig)),
      ONE_YEAR_SECONDS,
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

export const fantomSetts: VaultDefinition[] = [];
