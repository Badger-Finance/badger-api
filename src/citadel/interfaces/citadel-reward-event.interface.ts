import { RewardEventType } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';

export interface CitadelRewardEvent {
  account: string;
  block: number;
  token: string;
  amount: number;
  epoch: number;
  payType: RewardEventType;
  dataType?: string;
  startTime?: number;
  finishTime?: number;
}
