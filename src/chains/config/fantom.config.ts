import { Network, Protocol } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { Chain } from './chain.config';
import { ONE_YEAR_SECONDS } from '../../config/constants';
import { fantomTokensConfig } from '../../tokens/config/fantom-tokens.config';
import { FantomStrategy } from '../strategies/fantom.strategy';

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
      new FantomStrategy(Object.keys(fantomTokensConfig)),
      ONE_YEAR_SECONDS,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }

  getBadgerTokenAddress(): string {
    return TOKENS.MULTI_BADGER;
  }
}

export const fantomSetts: VaultDefinition[] = [
  {
    name: 'USDC/DAI',
    createdBlock: 30679386,
    depositToken: TOKENS.SMM_USDC_DAI,
    vaultToken: TOKENS.BSMM_USDC_DAI,
    protocol: Protocol.Convex,
  },
];
