import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ONE_DAY_SECONDS, PRODUCTION, UNCLAIMED_SNAPSHOTS_DATA } from '../../config/constants';
import { ClaimableBalance } from '../../rewards/entities/claimable-balance';

@table(UNCLAIMED_SNAPSHOTS_DATA)
export class UserClaimSnapshot {
  @hashKey({
    indexKeyConfigurations: {
      IndexUnclaimedSnapshotsOnAddressAndChainStartBlock: 'RANGE',
    },
  })
  chainStartBlock!: string;

  @rangeKey({
    indexKeyConfigurations: {
      IndexUnclaimedSnapshotsOnAddressAndChainStartBlock: 'HASH',
    },
  })
  address!: string;

  @attribute()
  chain!: string;

  @attribute()
  startBlock!: number;

  @attribute({ memberType: embed(ClaimableBalance) })
  claimableBalances!: Array<ClaimableBalance>;

  @attribute()
  pageId!: number;

  /**
   * The TTL attribute’s value must be a timestamp in Unix epoch time format in seconds.
   * If you use any other format, the TTL processes ignore the item.
   * For example, if you set the value of the attribute to 1645119622,|
   * that is Thursday, February 17, 2022 17:40:22 (GMT), the item will be expired after that time.
   * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/time-to-live-ttl-before-you-start.html
   */
  @attribute({
    defaultProvider: () => {
      const today = Date.now() / 1000;
      const expireTime = ONE_DAY_SECONDS * (PRODUCTION ? 30 : 1);
      return today + expireTime;
    },
  })
  expiresAt!: number;
}
