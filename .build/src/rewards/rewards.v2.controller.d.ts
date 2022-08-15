import { ListRewardsResponse } from "./interfaces/list-rewards-response.interface";
import { RewardsService } from "./rewards.service";
export declare class RewardsV2Controller {
  readonly rewardsService: RewardsService;
  list(chainId?: string, pageNum?: number, pageCount?: number): Promise<ListRewardsResponse>;
  private userClaimedSnapshotToDebankUser;
}
