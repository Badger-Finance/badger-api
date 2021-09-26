import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class SettStrategy {
  @attribute()
  address!: string;

  @attribute()
  withdrawFee!: number;

  @attribute()
  performanceFee!: number;

  @attribute()
  strategistFee!: number;
}
