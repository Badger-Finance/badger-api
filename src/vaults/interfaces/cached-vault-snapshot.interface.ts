import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { VAULT_SNAPSHOTS_DATA } from '../../config/constants';
import { VaultStrategy } from './vault-strategy.interface';

@table(VAULT_SNAPSHOTS_DATA)
export class CachedVaultSnapshot {
  @hashKey()
  address!: string;

  @attribute()
  balance!: number;

  @attribute()
  pricePerFullShare!: number;

  @attribute()
  value!: number;

  @attribute()
  supply!: number;

  @attribute()
  available!: number;

  @attribute()
  boostWeight!: number;

  @attribute({ memberType: embed(VaultStrategy) })
  strategy!: VaultStrategy;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
