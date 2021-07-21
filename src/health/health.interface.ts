import { HealthSnapshot } from './health.types';

export interface HealthService {
  getHealth: () => Promise<HealthSnapshot>;
  getResults: () => Promise<unknown>;
  importConfig: () => boolean;
}
