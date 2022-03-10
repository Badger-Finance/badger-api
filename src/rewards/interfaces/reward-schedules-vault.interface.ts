import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';

export interface EmissionSchedule {
  vault: VaultDefinition['vaultToken'];
  beneficiary: string;
  token: string;
  amount: number;
  start: number;
  end: number;
  compPercent: number;
}

export interface RewardSchedulesByVaults {
  [address: VaultDefinition['vaultToken']]: EmissionSchedule[];
}

export interface RewardSchedulesByVault {
  schedules: EmissionSchedule[];
}
