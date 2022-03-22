import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { VaultSnapshot } from '@badger-dao/sdk';
import { VAULT_SNAPSHOTS_DATA } from '../../config/constants';
import { VaultStrategy } from '../interfaces/vault-strategy.interface';

@table(VAULT_SNAPSHOTS_DATA)
export class CurrentVaultSnapshot implements VaultSnapshot {
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
  yieldApr!: number;

  @attribute()
  harvestApr!: number;

  @attribute()
  strategyBalance!: number;
}
