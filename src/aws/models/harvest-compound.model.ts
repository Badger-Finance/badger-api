import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { HARVEST_COMPOUND_DATA } from '../../config/constants';
import { VaultHarvestsExtended } from '../../vaults/interfaces/vault-harvest-extended.interface';
import { HarvestType } from '../../vaults/enums/harvest.enum';

@table(HARVEST_COMPOUND_DATA)
export class HarvestCompoundData implements VaultHarvestsExtended {
  @hashKey()
  vault!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute()
  amount!: number;

  @attribute()
  strategyBalance!: number;

  @attribute()
  block!: number;

  @attribute()
  estimatedApr!: number;

  @attribute()
  eventType!: HarvestType;

  @hashKey()
  token!: string;
}
