import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { ValueSource } from '@badger-dao/sdk';

export class CachedYieldSource implements ValueSource {
  @attribute()
  name!: string;

  @attribute()
  apr!: number;

  @attribute()
  boostable!: boolean;

  @attribute()
  minApr!: number;

  @attribute()
  maxApr!: number;
}
