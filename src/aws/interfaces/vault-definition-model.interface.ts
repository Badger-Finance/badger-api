import { BouncerType, Network, Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { Stage } from '../../config/enums/stage.enum';

export interface IVaultDefinition {
  address: string;
  behavior: VaultBehavior;
  bouncer: BouncerType;
  chain: Network;
  client: string;
  createdAt: number;
  depositToken: string;
  isNew: boolean;
  isMigrating: boolean;
  isProduction: number;
  name: string;
  protocol: Protocol;
  releasedAt: number;
  stage: Stage;
  state: VaultState;
  updatedAt: number;
  version: VaultVersion;
}
