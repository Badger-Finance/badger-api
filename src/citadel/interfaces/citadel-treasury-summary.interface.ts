import { TreasuryPosition } from '../../treasury/interfaces/treasy-position.interface';

export interface CitadelTreasurySummary {
  value: number;
  valueBtc: number;
  valuePaid: number;
  valuePaidBtc: number;
  marketCapToTreasuryRatio: number;
  treasuryYieldApr: number;
  positions: TreasuryPosition[];
}
