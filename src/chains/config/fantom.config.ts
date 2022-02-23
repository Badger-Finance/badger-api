import { Network, Protocol, VaultState } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { Chain } from './chain.config';
import { ONE_YEAR_SECONDS } from '../../config/constants';
import { fantomTokensConfig } from '../../tokens/config/fantom-tokens.config';
import { Stage } from '../../config/enums/stage.enum';
import { BaseStrategy } from '../strategies/base.strategy';

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
      '0x89122c767A5F543e663DB536b603123225bc3823',
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
    stage: Stage.Staging,
    state: VaultState.Guarded,
    protocol: Protocol.Solidly,
  },
];