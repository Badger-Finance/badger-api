import { VaultEmissionData } from '../types/vault-emission-data';

export interface VaultYieldEvaluation {
  compoundApr: number;
  grossCompoundApr: number;
  compoundApy: number;
  grossCompoundApy: number;
  tokenEmissionAprs: VaultEmissionData;
}
