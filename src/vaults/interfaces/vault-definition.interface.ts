import { Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';
import { Chain } from '../../chains/config/chain.config';
import { Stage } from '../../config/enums/stage.enum';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';

export interface VaultDefinition {
  behavior?: VaultBehavior;
  bouncer?: BouncerType;
  // this may be temporary, as a way to include citadel vaults without exposing to badger ui
  client?: string;
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
  vaultToken: string;
  version?: VaultVersion;
}
