import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey } from '@aws/dynamodb-data-mapper-annotations';
import { CitadelTreasurySummary } from '../interfaces/citadel-treasury-summary.interface';
import { TreasuryPosition } from '../interfaces/treasy-position.interface';

export class CitadelTreasurySummarySnapshot implements CitadelTreasurySummary {
  @hashKey()
  treasury!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  updatedAt!: number;

  @attribute()
  value!: number;

  @attribute()
  valueBtc!: number;

  @attribute()
  valuePaid!: number;

  @attribute()
  valuePaidBtc!: number;

  @attribute()
  marketCapToTreasuryRatio!: number;

  @attribute()
  treasuryYieldApr!: number;

  @attribute({ memberType: embed(CachedTokenBalance) })
  positions!: TreasuryPosition[];
}
