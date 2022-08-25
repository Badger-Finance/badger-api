import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { ValueSource } from '@badger-dao/sdk';
import { SourceType } from 'aws-sdk/clients/codebuild';

export class CachedYieldSource implements ValueSource {
  @attribute()
  address!: string;

  @attribute()
  type!: SourceType;

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
