import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { USER_CLAIMED_METADATA } from '../../config/constants';

@table(USER_CLAIMED_METADATA)
export class UserClaimMetadata {
  @hashKey()
  chainStartBlock!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexMetadataChainAndStartBlock: 'RANGE',
    },
  })
  startBlock!: number;

  @hashKey({
    indexKeyConfigurations: {
      IndexMetadataChainAndStartBlock: 'HASH',
    },
  })
  chain!: string;

  @attribute()
  endBlock!: number;

  @attribute()
  cycle!: number;

  @attribute()
  count!: number;
}
