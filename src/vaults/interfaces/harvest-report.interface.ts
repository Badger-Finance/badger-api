import { HarvestType } from '@badger-dao/sdk';

export interface HarvestReport {
  date: string;
  type: HarvestType;
  amount: string;
  token: string;
  value: string;
  balance: string;
  apr: string;
}
