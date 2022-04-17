import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { HARVEST_COMPOUND_DATA } from '../../config/constants';
import { VaultHarvestsExtended } from '../interfaces/vault-harvest-extended.interface';
import { BigNumber } from 'ethers';
import { HarvestType } from '../enums/harvest.enum';
import { BigNumberDynamodbModel } from '../../aws/dynamodb.models/big-number.dynamodb.model';

@table(HARVEST_COMPOUND_DATA)
export class HarvestCompoundData implements VaultHarvestsExtended {
  @hashKey()
  vault!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute({ memberType: embed(BigNumberDynamodbModel) })
  amount!: BigNumber;

  @attribute()
  strategyBalance!: number;

  @attribute()
  block!: number;

  @attribute()
  estimatedApr!: number;

  @attribute()
  eventType!: HarvestType;

  @attribute()
  token!: string;
}
