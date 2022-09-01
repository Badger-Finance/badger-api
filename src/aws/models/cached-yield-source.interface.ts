import { attribute } from '@aws/dynamodb-data-mapper-annotations';

import { YieldSource } from './yield-source.model';

export class CachedYieldSource implements YieldSource {
  @attribute()
  name!: string;

  @attribute()
  boostable!: boolean;
}
