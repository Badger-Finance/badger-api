import { Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';
import { Chain } from '../../chains/config/chain.config';
import { Stage } from '../../config/enums/stage.enum';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { VaultTokenBalance } from '../types/vault-token-balance.interface';

export interface VaultDefinition {
  balanceDecimals?: number;
  behavior?: VaultBehavior;
  bouncer?: BouncerType;
  depositToken: string;
  deprecated?: boolean;
  experimental?: boolean;
  getTokenBalance?: (chain: Chain, token: string) => Promise<VaultTokenBalance>;
  name: string;
  newVault?: boolean;
  protocol?: Protocol;
  stage?: Stage;
  state?: VaultState;
  strategy?: string;
  supplyDecimals?: number;
  vaultToken: string;
  version?: VaultVersion;
}
