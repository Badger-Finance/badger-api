import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_DATA } from '../../config/constants';
import { IVaultSnapshot } from '../interfaces/vault-snapshot.interface';
import { VaultStrategy } from '../interfaces/vault-strategy.interface';

@table(SETT_DATA)
export class HistoricVaultSnapshot implements IVaultSnapshot {
  @attribute()
  block!: number;

  @rangeKey({ defaultProvider: () => Date.now() })
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

  @attribute()
  apr!: number;
}
