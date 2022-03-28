import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { VaultStrategy as IVaultStrategy } from '@badger-dao/sdk';

export class VaultStrategy implements IVaultStrategy {
  @attribute()
  address!: string;

  @attribute()
  withdrawFee!: number;

  @attribute()
  performanceFee!: number;

  @attribute()
  strategistFee!: number;

  @attribute()
  aumFee!: number;
}
