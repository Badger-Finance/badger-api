import { Network, Protocol, VaultBehavior, VaultState } from '@badger-dao/sdk';
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
    name: '👻 BOO/xBOO',
    behavior: VaultBehavior.Ecosystem,

    depositToken: TOKENS.SMM_BOO_XBOO,
    vaultToken: TOKENS.BSMM_BOO_XBOO_ECO,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WBTC/renBTC',
    behavior: VaultBehavior.Compounder,

    depositToken: TOKENS.SMM_WBTC_RENBTC,
    vaultToken: TOKENS.BSMM_WBTC_RENBTC,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/SEX',
    behavior: VaultBehavior.EcosystemHelper,

    depositToken: TOKENS.SMM_WFTM_SEX,
    vaultToken: TOKENS.BSMM_WFTM_SEX,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'SOLID/SOLIDsex',
    behavior: VaultBehavior.EcosystemHelper,

    depositToken: TOKENS.SMM_SOLID_SOLIDSEX,
    vaultToken: TOKENS.BSMM_SOLID_SOLIDSEX,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WEVE/USDC',
    behavior: VaultBehavior.Compounder,

    depositToken: TOKENS.SMM_WEVE_USDC,
    vaultToken: TOKENS.BSMM_WEVE_USDC,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'OXD/USDC',
    behavior: VaultBehavior.Compounder,

    depositToken: TOKENS.SMM_OXD_USDC,
    vaultToken: TOKENS.BSMM_OXD_USDC,
    stage: Stage.Staging,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/CRV',
    behavior: VaultBehavior.DCA,

    depositToken: TOKENS.SMM_WFTM_CRV,
    vaultToken: TOKENS.BSMM_WFTM_CRV,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'USDC/MIM',
    behavior: VaultBehavior.DCA,

    depositToken: TOKENS.SMM_USDC_MIM,
    vaultToken: TOKENS.BSMM_USDC_MIM,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/renBTC',
    behavior: VaultBehavior.DCA,

    depositToken: TOKENS.SMM_WFTM_RENBTC,
    vaultToken: TOKENS.BSMM_WFTM_RENBTC,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: 'GEIST/g3CRV',
    behavior: VaultBehavior.DCA,

    depositToken: TOKENS.SMM_GEIST_3CRV,
    vaultToken: TOKENS.BSMM_GEIST_3CRV_DCA,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/CRV',
    behavior: VaultBehavior.Ecosystem,

    depositToken: TOKENS.SMM_WFTM_CRV,
    vaultToken: TOKENS.BSMM_WFTM_CRV_ECO,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 USDC/MIM',
    behavior: VaultBehavior.Ecosystem,

    depositToken: TOKENS.SMM_USDC_MIM,
    vaultToken: TOKENS.BSMM_USDC_MIM_ECO,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/SCREAM',
    behavior: VaultBehavior.Ecosystem,

    depositToken: TOKENS.SMM_WFTM_SCREAM,
    vaultToken: TOKENS.BSMM_WFTM_SCREAM_ECO,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/renBTC',
    behavior: VaultBehavior.Ecosystem,

    depositToken: TOKENS.SMM_WFTM_RENBTC,
    vaultToken: TOKENS.BSMM_WFTM_RENBTC_ECO,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/TOMB',
    behavior: VaultBehavior.Ecosystem,

    depositToken: TOKENS.SMM_WFTM_TOMB,
    vaultToken: TOKENS.BSMM_WFTM_TOMB_ECO,
    state: VaultState.Guarded,
    protocol: Protocol.Solidex,
  },
];
