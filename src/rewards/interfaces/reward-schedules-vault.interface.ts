import { EmissionSchedule } from '@badger-dao/sdk/lib/rewards/interfaces/emission-schedule.interface';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';

export { EmissionSchedule };

export interface RewardSchedulesByVaults {
  [address: VaultDefinitionModel['address']]: EmissionSchedule[];
}
