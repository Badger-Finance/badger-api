import { Description, Example, Property, Title } from '@tsed/schema';

import { EmissionSchedule, RewardSchedulesByVault, RewardSchedulesByVaults } from './reward-schedules-vault.interface';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { rewardSchedules, firstVaultAddr } from '../examples/reward-schedules-vaults.mock';

export class RewardSchedulesByVaultModel implements RewardSchedulesByVault {
  @Title('schedules')
  @Description('Rewards schedules by vaults map')
  @Example(rewardSchedules[firstVaultAddr])
  @Property()
  schedules: EmissionSchedule[];

  constructor(rewardSchedulesResp: RewardSchedulesByVault) {
    this.schedules = rewardSchedulesResp.schedules;
  }
}

@Description('Rewards schedules by vaults map')
@Example(rewardSchedules)
export class RewardSchedulesByVaultsModel implements RewardSchedulesByVaults {
  [address: VaultDefinition['vaultToken']]: EmissionSchedule[];
}
