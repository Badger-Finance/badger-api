import { UserBoostData } from '@badger-dao/sdk';

export interface UserBoostMultiplier extends UserBoostData {
  multipliers: Record<string, number>;
}
