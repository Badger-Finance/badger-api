import { Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { TokenDestructor } from '../../tokens/destructors/token.destructor';
import { BoostDestructor } from '../../vaults/destructors/boost.destructor';
import { VaultStrategy } from '../../vaults/interfaces/vault-strategy.interface';

export interface IVaultCompoundModel {
  address: string;
  createdAt: number;
  chain: string;
  isProduction: number;
  name: string;
  version: VaultVersion;
  state: VaultState;
  protocol: Protocol;
  behavior: VaultBehavior;
  strategy: VaultStrategy;
  boost: BoostDestructor;
  depositToken: TokenDestructor;
  client: string;
  available: number;
  block: number;
  balance: number;
  strategyBalance: number;
  totalSupply: number;
  pricePerFullShare: number;
  value: number;
  apr: number;
  yieldApr: number;
  harvestApr: number;
  updatedAt: number;
  releasedAt: number;
  timestamp: number;
  isNew: () => boolean;
}
