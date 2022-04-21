import { TreasuryPosition } from './treasy-position.interface';

export interface TreasurySummary {
  address: string;
  value: number;
  yield: number;
  positions: TreasuryPosition[];
}
