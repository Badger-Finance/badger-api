import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { HARVEST_COMPOUND_DATA } from '../../config/constants';
import { VaultHarvestsExtended } from '../interfaces/vault-harvest-extended.interface';
import { HarvestType } from '../enums/harvest.enum';

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
