import { Description, Example } from '@tsed/schema';

import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { rewardSchedules } from '../examples/reward-schedules-vaults.mock';
import { EmissionSchedule, RewardSchedulesByVaults } from './reward-schedules-vault.interface';

@Description('Rewards schedules by vaults map')
@Example(rewardSchedules)
export class RewardSchedulesByVaultsModel implements RewardSchedulesByVaults {
  [address: VaultDefinition['vaultToken']]: EmissionSchedule[];
}
