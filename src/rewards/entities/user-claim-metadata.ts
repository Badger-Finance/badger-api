import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { USER_CLAIMED_METADATA } from '../../config/constants';

@table(USER_CLAIMED_METADATA)
export class UserClaimMetadata {
  @rangeKey({
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
  chainStartBlock!: string;

  @attribute()
  endBlock!: number;
}
