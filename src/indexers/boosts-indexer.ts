import { UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getBoostFile } from '../accounts/accounts.utils';
import { CachedAccount } from '../aws/models/cached-account.model';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { CachedBoostMultiplier } from '../rewards/interfaces/cached-boost-multiplier.interface';
import { SUPPORTED_CHAINS } from '../chains/chain';

/**
 * Top level indexer call to separate chain updates.
 * Each chain is independently updated in its own promise
 * such that a single chain failure will not cause others to fail.
 */
export async function refreshUserBoosts() {
  await Promise.all(SUPPORTED_CHAINS.map((c) => exports.updateChainBoosts(c)));

  return 'done';
}

/**
 * Update user boost multipliers for a given chain.
 * @param chain Network users to update boost.
 */
export async function updateChainBoosts(chain: Chain): Promise<void> {
  try {
    // boosted data is only relevant on chains that have an emisison control
    if (!chain.emissionControl) {
      return;
    }

    // load the boost file, this is a requirement to be present for any chain with emisison control
    const file = await getBoostFile(chain);
    if (!file) {
      throw new UnprocessableEntity(`Unable to load boost file for ${chain.name}, expected file to exist!`);
    }

    console.log({
      chain: chain.network,
      multipliers: file.multiplierData,
    });
    const boostMultipliers = evaluateUserBoosts(chain, file);

    // construct batch queries for all users accounts, and fetch their stored entities
    const mapper = getDataMapper();
    const requestedAccounts = Object.keys(boostMultipliers).map((addr) =>
      Object.assign(new CachedAccount(), { address: ethers.utils.getAddress(addr) }),
    );
    const cachedAccounts = [];
    for await (const account of mapper.batchGet(requestedAccounts)) {
      cachedAccounts.push(account);
    }

    // update the stored account multipliers, removing old chain multipliers
    for (const account of cachedAccounts) {
      const userChainMultipliers = boostMultipliers[account.address];
      account.multipliers = account.multipliers.filter((m) => m.network !== chain.network).concat(userChainMultipliers);
    }

    for await (const _saved of mapper.batchPut(cachedAccounts));
  } catch (err) {
    console.error(err);
  }
}

/**
 * Evaluate the user boost and multipliers to update the user boost multipliers if required.
 * User boost multipliers supplied from the rewards JSON are the default values, and if the calculated
 * multiplier does not match (i.e. their boost has updated since last calculation) then the new estimate
 * will be displayed. This allows for a much shorter update time on the 'My Boost' values.
 * @param file Boost file to calculate user
 * @returns Mapping of user addresses to their new updated boost multipliers.
 */
export function evaluateUserBoosts(chain: Chain, file: BoostData): Record<string, CachedBoostMultiplier[]> {
  const { multiplierData, userData } = file;
  const boostMultipliers: Record<string, CachedBoostMultiplier[]> = {};

  /**
   * Iterate over all values in the boost file checking boost and multipliers.
   * Using the multiplier data from the boost file and the updated boost values
   * estimate the users current mutltiplier.
   *
   * If the keys do not match, or if the key is missing, this new estimated
   * boost multiplier will be set for the user.
   */
  for (const address of Object.keys(userData)) {
    const { multipliers, boost } = userData[address];
    const percentile = boost / 2000;
    Object.entries(multiplierData).forEach((entry) => {
      const [key, value] = entry;
      const range = value.max - value.min;
      const estimatedMultiplier = value.min + percentile * range;
      if (multipliers[key] !== estimatedMultiplier) {
        multipliers[key] = estimatedMultiplier;
      }
    });
    boostMultipliers[address] = Object.entries(multipliers).map((m) =>
      Object.assign(new CachedBoostMultiplier(), {
        address: m[0],
        network: chain.network,
        multiplier: m[1],
      }),
    );
  }

  return boostMultipliers;
}
