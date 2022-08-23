import { HarvestType } from '@badger-dao/sdk';

export interface HarvestReport {
  date: number;
  type: HarvestType;
  amount: number;
  token: string;
  value: number;
  balance: number;
  apr: number;
}
