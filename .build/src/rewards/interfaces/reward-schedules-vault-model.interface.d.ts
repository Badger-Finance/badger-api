import { EmissionSchedule } from "./reward-schedules-vault.interface";
export declare class RewardSchedulesByVaultModel implements EmissionSchedule {
  beneficiary: string;
  token: string;
  amount: number;
  start: number;
  end: number;
  compPercent: number;
  constructor(rewardSchedulesResp: EmissionSchedule);
}
