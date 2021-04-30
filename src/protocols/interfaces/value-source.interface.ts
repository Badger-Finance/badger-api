import { Performance } from './performance.interface';

export interface ValueSource {
  name: string;
  apr: number;
  performance: Performance;
  harvestable?: boolean;
}

export const createValueSource = (name: string, performance: Performance, harvestable?: boolean): ValueSource => {
  const apr = Math.max(...Object.values(performance));
  return {
    name,
    apr,
    performance,
    harvestable,
  };
};
