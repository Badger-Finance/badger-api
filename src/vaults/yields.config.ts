import { TOKENS } from '../config/tokens.config';

const influenceVaults = new Set([TOKENS.BVECVX, TOKENS.GRAVI_AURA]);

export function isInfluenceVault(address: string) {
  return influenceVaults.has(address);
}
