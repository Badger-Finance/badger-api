import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { VAULT_SNAPSHOTS_DATA } from '../../config/constants';
import { IVaultSnapshot } from '../interfaces/vault-snapshot.interface';
import { VaultStrategy } from '../interfaces/vault-strategy.interface';

@table(VAULT_SNAPSHOTS_DATA)
export class VaultSnapshot implements IVaultSnapshot {
  @attribute()
  block!: number;

  @attribute({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @hashKey()
  address!: string;

  @attribute()
  available!: number;

  @attribute()
  balance!: number;

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
}
