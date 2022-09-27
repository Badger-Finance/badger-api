import { formatBalance, Vault__factory, YieldType } from '@badger-dao/sdk';
import { BigNumber, ethers } from 'ethers';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { CvxLocker__factory } from '../contracts/factories/CvxLocker__factory';
import { getBalancerPoolTokens } from '../protocols/strategies/balancer.strategy';
import { CVX_LOCKER, OLD_CVX_LOCKER } from '../protocols/strategies/convex.strategy';

// TODO: setup influence configs, voting periods, etc.
const influenceVaults = new Set([TOKENS.BVECVX, TOKENS.GRAVI_AURA]);

/**
 * Determines if a given address is a known influence vault.
 * @param address target vault address
 * @returns returns true if vault is an influence vault, and false if not
 */
export function isInfluenceVault(address: string) {
  return influenceVaults.has(ethers.utils.getAddress(address));
}

/**
 * Filters non relevant yield events from influence vaults.
 * Limits results to harvests, and a single badger distribution and
 * underlying token distribution garnered from incentives.
 *
 * Non influence vaults return all events given for filtering.
 * @param vault target vault address
 * @param yieldEvents yield events requested for filtering
 * @returns relevant yield events based on the vault type
 */
export function filterPerformanceItems(vault: VaultDefinitionModel, yieldEvents: VaultYieldEvent[]): VaultYieldEvent[] {
  if (!isInfluenceVault(vault.address)) {
    return yieldEvents;
  }

  const { address } = vault;
  let relevantEvents = yieldEvents.slice().sort((a, b) => b.timestamp - a.timestamp);

  let processedBadger = false;
  let processedUnderlying = false;
  relevantEvents = relevantEvents.filter((e) => {
    // always return harvests events
    if (e.type === YieldType.Harvest) {
      return true;
    }

    // only allow a single badger distribution
    if (e.token === TOKENS.BADGER) {
      if (processedBadger) {
        return false;
      }
      processedBadger = true;
      return true;
    }

    // only allow a single underlying distribution
    if (e.token === address) {
      if (processedUnderlying) {
        return false;
      }
      processedUnderlying = true;
      return true;
    }
    return true;
  });

  return relevantEvents;
}

/**
 * Asses the vault strategy funds being used at time of harvest.
 * @param chain network of associated vault
 * @param vault target vault information
 * @param blockTag block requesting data at
 * @returns the balance the strategy of the requested vault is farming with at the given block
 */
export async function getVaultHarvestBalance(
  chain: Chain,
  vault: VaultDefinitionModel,
  blockTag: number,
): Promise<number> {
  const sdk = await chain.getSdk();
  const { address, version } = vault;
  const vaultContract = Vault__factory.connect(address, sdk.provider);
  const strategyBalance = await vaultContract.totalSupply({ blockTag });
  const maxBalance = formatBalance(strategyBalance);

  if (!isInfluenceVault(address)) {
    return maxBalance;
  }

  if (address === TOKENS.BVECVX) {
    // there is no balance possible before the deployment block
    if (blockTag <= 13153663) {
      return 0;
    }
    const lockerAddress = blockTag < 14320609 ? OLD_CVX_LOCKER : CVX_LOCKER;
    const strategyAddress = await sdk.vaults.getVaultStrategy({ address, version }, { blockTag });
    const locker = CvxLocker__factory.connect(lockerAddress, sdk.provider);

    let lockedBalance = BigNumber.from('0');

    try {
      lockedBalance = await locker.lockedBalanceOf(strategyAddress, { blockTag });
    } catch (err) {
      lockedBalance = strategyBalance;
    }

    const votingBalance = formatBalance(lockedBalance);

    // there is some weirdness with swapping contracts at block 14353146 - just use a fallback
    if (votingBalance > 0) {
      return votingBalance;
    } else {
      return maxBalance;
    }
  }

  // one strange thing to note here is when a pool didn't exist - and we are trying to check on it
  // deal with GRAVI_AURA - this won't scale so we need to figure out how to generalize it
  const excludedPools = [TOKENS.BPT_GRAV_AURABAL_WETH, TOKENS.BPT_GRAV_DIGG_WBTC];

  let blacklistedBalance = 0;
  for (const pool of excludedPools) {
    try {
      const tokens = await getBalancerPoolTokens(chain, pool, blockTag);
      const graviAura = tokens.find((t) => t.address === TOKENS.GRAVI_AURA);
      if (graviAura) {
        blacklistedBalance += graviAura.balance;
      }
    } catch (err) {
      console.debug({
        chain: chain.network,
        vault: address,
        blockTag,
        err,
      });
    }
  }

  return maxBalance - blacklistedBalance;
}
