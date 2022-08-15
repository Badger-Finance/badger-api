import { ClaimableBalance } from "../../rewards/entities/claimable-balance";
export declare class UserClaimSnapshot {
  chainStartBlock: string;
  address: string;
  chain: string;
  startBlock: number;
  claimableBalances: Array<ClaimableBalance>;
  pageId: number;
  /**
   * The TTL attribute’s value must be a timestamp in Unix epoch time format in seconds.
   * If you use any other format, the TTL processes ignore the item.
   * For example, if you set the value of the attribute to 1645119622,|
   * that is Thursday, February 17, 2022 17:40:22 (GMT), the item will be expired after that time.
   * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/time-to-live-ttl-before-you-start.html
   */
  expiresAt: number;
}
