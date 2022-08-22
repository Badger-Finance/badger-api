export interface VaultYieldSummary {
  compoundApr: number;
  compoundApy: number;
  tokenEmissionAprs: Map<string, number>;
}
