import { formatBalance, Vault__factory } from '@badger-dao/sdk';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { getBalancerPoolTokens } from '../protocols/strategies/balancer.strategy';

// TODO: setup influence configs, voting periods, etc.
const influenceVaults = new Set([TOKENS.BVECVX, TOKENS.GRAVI_AURA]);

export function isInfluenceVault(address: string) {
  return influenceVaults.has(address);
}

export async function getInfuelnceVaultYieldBalance(
  chain: Chain,
  address: string,
  targetBlock: number,
): Promise<number> {
  const sdk = await chain.getSdk();
  const vaultContract = Vault__factory.connect(address, sdk.provider);
  const strategyBalance = await vaultContract.totalSupply({ blockTag: targetBlock });

  const maxBalance = formatBalance(strategyBalance);
  // TODO: tidy this up probably, or rethink with the configs how we deal with this
  if (address === TOKENS.BVECVX) {
    return maxBalance;
  }

  // deal with GRAVI_AURA - this won't scale so we need to figure out how to generalize it
  const excludedPools = [TOKENS.BPT_GRAV_AURABAL_WETH, TOKENS.BPT_GRAV_DIGG_WBTC];

  let blacklistedBalance = 0;
  for (const pool of excludedPools) {
    const tokens = await getBalancerPoolTokens(chain, pool);
    const graviAura = tokens.find((t) => t.address === TOKENS.GRAVI_AURA);
    if (graviAura) {
      blacklistedBalance += graviAura.balance;
    }
  }

  return maxBalance - blacklistedBalance;
}
