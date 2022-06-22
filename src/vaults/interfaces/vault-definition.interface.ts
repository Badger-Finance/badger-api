import { Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { Chain } from '../../chains/config/chain.config';
import { Stage } from '../../config/enums/stage.enum';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';

// remove after regV2 migration
export interface VaultDefinition {
  behavior?: VaultBehavior;
  bouncer?: BouncerType;
  client?: string | Protocol;
  depositToken: string;
  experimental?: boolean;
  getTokenBalance?: (chain: Chain, token: string) => Promise<VaultTokenBalance>;
  name: string;
  newVault?: boolean;
  protocol?: Protocol;
  stage?: Stage;
  state?: VaultState;
  vaultToken: string;
  version?: VaultVersion;
}
