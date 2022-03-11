import { Description, Example, Property, Title } from '@tsed/schema';

import { EmissionScheduleApi } from './reward-schedules-vault.interface';
import { rewardSchedules, firstVaultAddr } from '../examples/reward-schedules-vaults.mock';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';

@Description('Rewards schedules by vaults map')
@Example(rewardSchedules[firstVaultAddr])
export class RewardSchedulesByVaultModel implements EmissionScheduleApi {
  @Title('beneficiary')
  @Description('To whom token emmited')
  @Property()
  public beneficiary: string;

  @Title('token')
  @Description('Token addr')
  @Property()
  public token: string;

  @Title('amount')
  @Description('Amount of emmited token')
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

  @Title('vault')
  @Description('Vault addr on which token was emitted')
  @Property()
  public vault: VaultDefinition['vaultToken'];

  @Title('compPercent')
  @Description('Percent of schedule completion')
  @Property()
  public compPercent: number;

  constructor(rewardSchedulesResp: EmissionScheduleApi) {
    this.beneficiary = rewardSchedulesResp.beneficiary;
    this.token = rewardSchedulesResp.token;
    this.amount = rewardSchedulesResp.amount;
    this.start = rewardSchedulesResp.start;
    this.end = rewardSchedulesResp.end;
    this.vault = rewardSchedulesResp.vault;
    this.compPercent = rewardSchedulesResp.compPercent;
  }
}
