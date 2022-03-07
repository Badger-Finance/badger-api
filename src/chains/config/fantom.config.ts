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
    name: 'BOO/xBOO',
    createdBlock: 31817699,
    depositToken: TOKENS.SMM_BOO_XBOO,
    vaultToken: TOKENS.BSMM_BOO_XBOO,
    stage: Stage.Staging,
    state: VaultState.Guarded,
    protocol: Protocol.Solidly,
  },
  {
    name: 'WBTC/renBTC',
    createdBlock: 31817121,
    depositToken: TOKENS.SMM_WBTC_RENBTC,
    vaultToken: TOKENS.BSMM_WBTC_RENBTC,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/SEX',
    createdBlock: 32237088,
    depositToken: TOKENS.SMM_WFTM_SEX,
    vaultToken: TOKENS.BSMM_WFTM_SEX,
    stage: Stage.Staging,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'SOLID/SOLIDsex',
    createdBlock: 32237094,
    depositToken: TOKENS.SMM_SOLID_SOLIDSEX,
    vaultToken: TOKENS.BSMM_SOLID_SOLIDSEX,
    stage: Stage.Staging,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WEVE/USDC',
    createdBlock: 32237094,
    depositToken: TOKENS.SMM_WEVE_USDC,
    vaultToken: TOKENS.BSMM_WEVE_USDC,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'OXD/USDC',
    createdBlock: 32477300,
    depositToken: TOKENS.SMM_OXD_USDC,
    vaultToken: TOKENS.BSMM_OXD_USDC,
    stage: Stage.Staging,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/CRV',
    createdBlock: 32477300,
    depositToken: TOKENS.SMM_WFTM_CRV,
    vaultToken: TOKENS.BSMM_WFTM_CRV,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'USDC/MIM',
    createdBlock: 32477300,
    depositToken: TOKENS.SMM_USDC_MIM,
    vaultToken: TOKENS.BSMM_USDC_MIM,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/renBTC',
    createdBlock: 32477300,
    depositToken: TOKENS.SMM_WFTM_RENBTC,
    vaultToken: TOKENS.BSMM_WFTM_RENBTC,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'GEIST/g3CRV',
    createdBlock: 32803942,
    depositToken: TOKENS.SMM_GEIST_3CRV,
    vaultToken: TOKENS.BSMM_GEIST_3CRV,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
];
