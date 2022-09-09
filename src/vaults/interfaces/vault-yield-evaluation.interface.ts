import { VaultEmissionData } from '../types/vault-emission-data';

export interface VaultYieldEvaluation {
  compoundApr: number;
  compoundApy: number;
  tokenEmissionAprs: VaultEmissionData;
}
