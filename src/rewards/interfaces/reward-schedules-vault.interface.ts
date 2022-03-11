import { EmissionSchedule } from '@badger-dao/sdk/lib/rewards/interfaces/emission-schedule.interface';

import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';

export { EmissionSchedule };

export interface RewardSchedulesByVaults {
  [address: VaultDefinition['vaultToken']]: EmissionSchedule[];
}
