import { formatBalance, Vault__factory } from '@badger-dao/sdk';
import { BigNumber, ethers } from 'ethers';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultYieldEvent } from '../aws/models/vault-yield-event.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { CvxLocker__factory } from '../contracts/factories/CvxLocker__factory';
import { getBalancerPoolTokens } from '../protocols/strategies/balancer.strategy';
import { CVX_LOCKER } from '../protocols/strategies/convex.strategy';
import { YieldType } from './enums/yield-type.enum';

// TODO: setup influence configs, voting periods, etc.
const influenceVaults = new Set([TOKENS.BVECVX, TOKENS.GRAVI_AURA]);

export function isInfluenceVault(address: string) {
  return influenceVaults.has(ethers.utils.getAddress(address));
}

export function filterPerformanceItems(vault: VaultDefinitionModel, yieldEvents: VaultYieldEvent[]): VaultYieldEvent[] {
  if (!isInfluenceVault(vault.address)) {
    return yieldEvents;
  }

  const { address } = vault;
  let relevantEvents = yieldEvents.slice().sort((a, b) => b.timestamp - a.timestamp);

  let processedBadger = false;
  let processedUnderlying = false;
  relevantEvents = relevantEvents.filter((e) => {
    if (e.type === YieldType.Harvest) {
      return true;
    }
    if (e.token === TOKENS.BADGER) {
      if (processedBadger) {
        return false;
      }
      processedBadger = true;
      return true;
    }
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

// TODO: think about this... ironically nearly doing the same for other vaults...
export async function getInfuelnceVaultYieldBalance(
  chain: Chain,
  vault: VaultDefinitionModel,
  blockTag: number,
): Promise<number> {
  const sdk = await chain.getSdk();
  const { address, version } = vault;
  const vaultContract = Vault__factory.connect(address, sdk.provider);

  if (address === TOKENS.BVECVX) {
    // there is no balance possible before the deployment block
    if (blockTag <= 14320609) {
      return 0;
    }
    const strategyAddress = await sdk.vaults.getVaultStrategy({ address, version }, { blockTag });
    const locker = CvxLocker__factory.connect(CVX_LOCKER, sdk.provider);

    let lockedBalance = BigNumber.from('0');

    try {
      lockedBalance = await locker.lockedBalanceOf(strategyAddress, { blockTag });
    } catch (err) {
      lockedBalance = await vaultContract.totalSupply({ blockTag });
    }

    return formatBalance(lockedBalance);
  }

  const strategyBalance = await vaultContract.totalSupply({ blockTag });
  const maxBalance = formatBalance(strategyBalance);

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
