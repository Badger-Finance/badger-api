import { TreasuryPosition } from '../interfaces/treasy-position.interface';

export class CachedTreasuryPosition implements TreasuryPosition {
  token: Token;
  amount: number;
  value: number;
  protocol?: Protocol | string;
  apr: number;
}
