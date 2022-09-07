import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { YieldSummary as IYieldSummary } from '@badger-dao/sdk';

export class YieldSummary implements IYieldSummary {
  @attribute()
  baseYield!: number;

  @attribute()
  grossYield!: number;

  @attribute()
  minYield!: number;

  @attribute()
  maxYield!: number;

  @attribute()
  minGrossYield!: number;

  @attribute()
  maxGrossYield!: number;
}
