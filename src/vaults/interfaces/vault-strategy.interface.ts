import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class VaultStrategy {
  @attribute()
  address!: string;

  @attribute()
  withdrawFee!: number;

  @attribute()
  performanceFee!: number;

  @attribute()
  strategistFee!: number;
}
