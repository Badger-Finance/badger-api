export interface VaultYieldEvaluation {
  compoundApr: number;
  compoundApy: number;
  tokenEmissionAprs: Map<string, number>;
}
