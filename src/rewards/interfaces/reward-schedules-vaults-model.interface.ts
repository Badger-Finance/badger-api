import { Description, Example } from "@tsed/schema";

import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { rewardSchedules } from "../examples/reward-schedules-vaults.mock";
import { EmissionSchedule, RewardSchedulesByVaults } from "./reward-schedules-vault.interface";

@Description("Rewards schedules by vaults map")
@Example(rewardSchedules)
export class RewardSchedulesByVaultsModel implements RewardSchedulesByVaults {
  [address: VaultDefinitionModel["address"]]: EmissionSchedule[];
}
