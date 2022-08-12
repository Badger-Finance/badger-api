import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { EmissionSchedule, RewardSchedulesByVaults } from './reward-schedules-vault.interface';
export declare class RewardSchedulesByVaultsModel implements RewardSchedulesByVaults {
    [address: VaultDefinitionModel['address']]: EmissionSchedule[];
}
