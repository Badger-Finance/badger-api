import { Network, Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { Stage } from '../../config/enums/stage.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { fantomTokensConfig } from '../../tokens/config/fantom-tokens.config';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Fantom extends Chain {
  constructor() {
    super(
      'Fantom',
      'fantom',
      '0xFA',
      Network.Fantom,
      fantomTokensConfig,
      rpc[Network.Fantom],
      fantomSetts,
      new BaseStrategy(Network.Fantom, Object.keys(fantomTokensConfig)),
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
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WBTC/renBTC',
    behavior: VaultBehavior.Compounder,
    depositToken: TOKENS.SMM_WBTC_RENBTC,
    vaultToken: TOKENS.BSMM_WBTC_RENBTC,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/SEX',
    behavior: VaultBehavior.EcosystemHelper,
    depositToken: TOKENS.SMM_WFTM_SEX,
    vaultToken: TOKENS.BSMM_WFTM_SEX,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'SOLID/SOLIDsex',
    behavior: VaultBehavior.EcosystemHelper,
    depositToken: TOKENS.SMM_SOLID_SOLIDSEX,
    vaultToken: TOKENS.BSMM_SOLID_SOLIDSEX,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WEVE/USDC',
    behavior: VaultBehavior.Compounder,
    depositToken: TOKENS.SMM_WEVE_USDC,
    vaultToken: TOKENS.BSMM_WEVE_USDC,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'OXD/USDC',
    behavior: VaultBehavior.Compounder,
    depositToken: TOKENS.SMM_OXD_USDC,
    vaultToken: TOKENS.BSMM_OXD_USDC,
    stage: Stage.Staging,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/CRV',
    behavior: VaultBehavior.DCA,
    depositToken: TOKENS.SMM_WFTM_CRV,
    vaultToken: TOKENS.BSMM_WFTM_CRV,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'USDC/MIM',
    behavior: VaultBehavior.DCA,
    depositToken: TOKENS.SMM_USDC_MIM,
    vaultToken: TOKENS.BSMM_USDC_MIM,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'WFTM/renBTC',
    behavior: VaultBehavior.DCA,
    depositToken: TOKENS.SMM_WFTM_RENBTC,
    vaultToken: TOKENS.BSMM_WFTM_RENBTC,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'GEIST/g3CRV',
    behavior: VaultBehavior.DCA,
    depositToken: TOKENS.SMM_GEIST_3CRV,
    vaultToken: TOKENS.BSMM_GEIST_3CRV_DCA,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/CRV',
    behavior: VaultBehavior.Ecosystem,
    depositToken: TOKENS.SMM_WFTM_CRV,
    vaultToken: TOKENS.BSMM_WFTM_CRV_ECO,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 USDC/MIM',
    behavior: VaultBehavior.Ecosystem,
    depositToken: TOKENS.SMM_USDC_MIM,
    vaultToken: TOKENS.BSMM_USDC_MIM_ECO,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/SCREAM',
    behavior: VaultBehavior.Ecosystem,
    depositToken: TOKENS.SMM_WFTM_SCREAM,
    vaultToken: TOKENS.BSMM_WFTM_SCREAM_ECO,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/renBTC',
    behavior: VaultBehavior.Ecosystem,
    depositToken: TOKENS.SMM_WFTM_RENBTC,
    vaultToken: TOKENS.BSMM_WFTM_RENBTC_ECO,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: '👻 WFTM/TOMB',
    behavior: VaultBehavior.Ecosystem,
    depositToken: TOKENS.SMM_WFTM_TOMB,
    vaultToken: TOKENS.BSMM_WFTM_TOMB_ECO,
    state: VaultState.Discontinued,
    protocol: Protocol.Solidex,
  },
  {
    name: 'bveOXD',
    depositToken: TOKENS.FTM_OXD_2,
    vaultToken: TOKENS.BVEOXD,
    state: VaultState.Discontinued,
    protocol: Protocol.OxDAO,
    version: VaultVersion.v1_5,
  },
  {
    name: 'boxSOLID',
    depositToken: TOKENS.FTM_OXSOLID,
    vaultToken: TOKENS.BOXSOLID,
    state: VaultState.Discontinued,
    protocol: Protocol.OxDAO,
    version: VaultVersion.v1_5,
    behavior: VaultBehavior.EcosystemHelper,
  },
  {
    name: 'bveOXD/OXD',
    depositToken: TOKENS.SMM_BVEOXD_OXD,
    vaultToken: TOKENS.BSMM_BVEOXD_OXD,
    state: VaultState.Discontinued,
    protocol: Protocol.OxDAO,
    version: VaultVersion.v1_5,
    behavior: VaultBehavior.EcosystemHelper,
  },
  {
    name: 'USDC/DEI',
    depositToken: TOKENS.SMM_USDC_DEI,
    vaultToken: TOKENS.BSMM_USDC_DEI,
    state: VaultState.Discontinued,
    protocol: Protocol.OxDAO,
    version: VaultVersion.v1_5,
    behavior: VaultBehavior.Ecosystem,
  },
];
