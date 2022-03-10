import { EmissionSchedule } from '@badger-dao/sdk/lib/rewards/interfaces/emission-schedule.interface';

import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';

export interface EmissionScheduleApi extends EmissionSchedule {
  vault: VaultDefinition['vaultToken'];
  compPercent: number;
}

export interface RewardSchedulesByVaults {
  [address: VaultDefinition['vaultToken']]: EmissionScheduleApi[];
}
