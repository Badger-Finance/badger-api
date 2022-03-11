import { Description, Example, Property, Title } from '@tsed/schema';

import { EmissionSchedule } from './reward-schedules-vault.interface';
import { rewardSchedules, firstVaultAddr } from '../examples/reward-schedules-vaults.mock';

@Description('Rewards schedules by vaults map')
@Example(rewardSchedules[firstVaultAddr])
export class RewardSchedulesByVaultModel implements EmissionSchedule {
  @Title('beneficiary')
  @Description('To whom token emmited')
  @Property()
  public beneficiary: string;

  @Title('token')
  @Description('Token addr')
  @Property()
  public token: string;

  @Title('amount')
  @Description('Total amount of emmited token')
  @Property()
  public amount: number;

  @Title('start')
  @Description('Schedule start timestamp')
  @Property()
  public start: number;

  @Title('end')
  @Description('Schedule end timestamp')
  @Property()
  public end: number;

  @Title('compPercent')
  @Description('Percent of schedule completion')
  @Property()
  public compPercent: number;

  constructor(rewardSchedulesResp: EmissionSchedule) {
    this.beneficiary = rewardSchedulesResp.beneficiary;
    this.token = rewardSchedulesResp.token;
    this.amount = rewardSchedulesResp.amount;
    this.start = rewardSchedulesResp.start;
    this.end = rewardSchedulesResp.end;
    this.compPercent = rewardSchedulesResp.compPercent;
  }
}
