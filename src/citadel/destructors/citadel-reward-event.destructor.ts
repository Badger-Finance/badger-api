import { CitadelRewardEvent } from '../interfaces/citadel-reward-event.interface';
import { CitadelRewardsSnapshot } from '../../aws/models/citadel-rewards-snapshot';
import { RewardEventType, RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';

export class CitadelRewardEventData implements CitadelRewardEvent {
  account: string;
  block: number;
  token: string;
  amount: number;
  epoch: number;
  payType: RewardEventType;
  dataType?: string;
  startTime?: number;
  finishTime?: number;

  constructor(data: CitadelRewardsSnapshot) {
    this.account = data.account;
    this.block = data.block;
    this.token = data.token;
    this.amount = data.amount;
    this.epoch = data.epoch;
    this.payType = data.payType;

    if (data.payType === RewardEventTypeEnum.ADDED) {
      this.dataType = data.dataType;
      this.startTime = data.startTime;
      this.finishTime = data.finishTime;
    }
  }
}
