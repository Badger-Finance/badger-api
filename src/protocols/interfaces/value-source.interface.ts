import { Performance } from './performance.interface';

export interface ValueSource {
  name: string;
  apy: number;
  performance: Performance;
  harvestable?: boolean;
}
