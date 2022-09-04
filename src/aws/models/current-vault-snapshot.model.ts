import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network, VaultSnapshot } from '@badger-dao/sdk';

import { VAULT_SNAPSHOTS_DATA } from '../../config/constants';
import { VaultStrategy } from '../../vaults/interfaces/vault-strategy.interface';

@table(VAULT_SNAPSHOTS_DATA)
export class CurrentVaultSnapshotModel implements VaultSnapshot {
  @hashKey()
  id!: string;

  @attribute()
  block!: number;

  @attribute({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute()
  address!: string;

  @attribute()
  chain!: Network;

  @attribute()
  available!: number;

  @attribute()
  balance!: number;

  @attribute()
  strategyBalance!: number;

  @attribute()
  totalSupply!: number;

  @attribute()
  pricePerFullShare!: number;

  @attribute()
  ratio?: number;

  @attribute({ memberType: embed(VaultStrategy) })
  strategy!: VaultStrategy;

  @attribute()
  boostWeight!: number;

  @attribute()
  value!: number;

  @attribute()
  apr!: number;

  @attribute()
  grossApr!: number;

  @attribute()
  yieldApr!: number;

  @attribute()
  harvestApr!: number;
}
