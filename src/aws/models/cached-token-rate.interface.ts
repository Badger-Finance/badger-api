import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { TokenRate } from '@badger-dao/sdk';

import { CachedTokenBalance } from './cached-token-balance.interface';

export class CachedTokenRate extends CachedTokenBalance implements TokenRate {
  @attribute()
  apr!: number;
}
