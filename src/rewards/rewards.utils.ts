import { Network, Protocol } from '@badger-dao/sdk';
import { BigNumber } from 'ethers';

import { getBoostFile, getCachedAccount } from '../accounts/accounts.utils';
import { CachedValueSource } from '../aws/models/apy-snapshots.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_YEAR_SECONDS, REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { getPrice } from '../prices/prices.utils';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { BalancerStrategy } from '../protocols/strategies/balancer.strategy';
import { ConvexStrategy } from '../protocols/strategies/convex.strategy';
import { OxDaoStrategy } from '../protocols/strategies/oxdao.strategy';
import { QuickswapStrategy } from '../protocols/strategies/quickswap.strategy';
import { SushiswapStrategy } from '../protocols/strategies/sushiswap.strategy';
import { SwaprStrategy } from '../protocols/strategies/swapr.strategy';
import { UniswapStrategy } from '../protocols/strategies/uniswap.strategy';
import { getFullToken, tokenEmission } from '../tokens/tokens.utils';
import { getCachedVault, getVaultPerformance } from '../vaults/vaults.utils';
import { SourceType } from './enums/source-type.enum';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';

export const DIGG_SHARE_PER_FRAGMENT = '222256308823765331027878635805365830922307440079959220679625904457';

export async function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null> {
  try {
    const fileName = `badger-tree-${parseInt(chain.chainId, 16)}.json`;
    const rewardFile = await getObject(REWARD_DATA, fileName);
    return JSON.parse(rewardFile.toString('utf-8'));
  } catch (err) {
    console.error({ message: `Missing expected badger tree file for ${chain.network}`, err });
    return null;
  }
}

export async function getClaimableRewards(
  chain: Chain,
  chainUsers: string[],
  distribution: RewardMerkleDistribution,
  blockNumber: number,
): Promise<[string, [string[], BigNumber[]]][]> {
  const { rewards } = await chain.getSdk();
  const { badgerTree } = rewards;
  const requests = chainUsers.map(async (user): Promise<[string, [string[], BigNumber[]]]> => {
    const proof = distribution.claims[user];
    if (!proof) {
      return [user, [[], []]];
    }
    let attempt = 0;
    while (attempt < 3) {
      try {
        const result = await badgerTree.getClaimableFor(user, proof.tokens, proof.cumulativeAmounts, {
          blockTag: blockNumber,
        });
        return [user, result];
      } catch (err) {
        for (let i = 0; i < proof.tokens.length; i++) {
          const token = proof.tokens[i];
          const amount = await badgerTree.claimed(user, token);
          if (BigNumber.from(proof.cumulativeAmounts[i]).lt(amount)) proof.cumulativeAmounts[i] = amount.toString();
        }
        attempt++;
        // report a recurring issue for claimable
        if (attempt === 3) {
          console.error(err);
        }
      }
    }
    return [user, [[], []]];
  });
  return Promise.all(requests);
}

export async function getRewardEmission(chain: Chain, vault: VaultDefinitionModel): Promise<CachedValueSource[]> {
  const boostFile = await getBoostFile(chain);
  const sdk = await chain.getSdk();

  if (!sdk.rewards.hasRewardsLogger() || vault.depositToken === TOKENS.DIGG || !boostFile) {
    return [];
  }
  const { address } = vault;
  const cachedVault = await getCachedVault(chain, vault);

  if (address === TOKENS.BVECVX) {
    delete boostFile.multiplierData[address];
  }
  const boostRange = boostFile.multiplierData[address] ?? { min: 1, max: 1 };
  const activeSchedules = await sdk.rewards.loadActiveSchedules(address);

  // Badger controlled addresses are blacklisted from receiving rewards. We only dogfood on ETH
  let ignoredTVL = 0;
  if (chain.network === Network.Ethereum) {
    const blacklistedAccounts = await Promise.all([
      getCachedAccount(chain, '0xB65cef03b9B89f99517643226d76e286ee999e77'), // dev multisig
      getCachedAccount(chain, '0x86cbD0ce0c087b482782c181dA8d191De18C8275'), // tech ops multisig
      getCachedAccount(chain, '0x042B32Ac6b453485e357938bdC38e0340d4b9276'), // treasury ops multisig
      getCachedAccount(chain, '0xD0A7A8B98957b9CD3cFB9c0425AbE44551158e9e'), // treasury vault
      getCachedAccount(chain, '0xA9ed98B5Fb8428d68664f3C5027c62A10d45826b'), // treasury bveCVX voting multisig
    ]);
    ignoredTVL = blacklistedAccounts
      .map((a) => a.data[vault.address])
      .map((s) => (s ? s.value : 0))
      .reduce((total, value) => total + value, 0);
  }

  /**
   * Calculate rewards emission percentages:
   *   - P: Price of Token
   *   - A: Amount of Token Emitted
   *   - D: Duration of Token Emission in Seconds
   *   - S: Number of Seconds Per Year
   *   - L: Amount of Value Locked in Sett
   *
   * Reward APR is determined by the extrapolated one year value emitted
   * from the unlock schedues as a percentage of the current locked value.
   *
   * APR = (P * A * (S / D)) / L * 100
   *
   * This vaule is calculated for all tokens emitted for any given sett
   * and persisted against that sett. There is a 20 minute grace period for
   * emission that have since ended, and only the latest active emission
   * will be used for yield calcuation.
   */

  const emissionSources = [];
  for (const schedule of activeSchedules) {
    const tokenPrice = await getPrice(schedule.token);
    const token = await getFullToken(chain, schedule.token);

    const durationScalar = ONE_YEAR_SECONDS / (schedule.end - schedule.start);
    const yearlyEmission = tokenPrice.price * schedule.amount * durationScalar;
    const apr = (yearlyEmission / (cachedVault.value - ignoredTVL)) * 100;
    let proRataAPR = apr;
    if (cachedVault.boost.enabled && token.address === chain.getBadgerTokenAddress()) {
      const boostedAPR = (cachedVault.boost.weight / 10_000) * proRataAPR;
      proRataAPR = proRataAPR - boostedAPR;
      const boostedSource = createValueSource(`Boosted ${token.name}`, boostedAPR, boostRange);
      emissionSources.push(valueSourceToCachedValueSource(boostedSource, vault, tokenEmission(token, true)));
    }
    const proRataSource = createValueSource(`${token.name}`, proRataAPR);
    emissionSources.push(valueSourceToCachedValueSource(proRataSource, vault, tokenEmission(token)));
  }
  return emissionSources;
}

export function valueSourceToCachedValueSource(
  valueSource: ValueSource,
  vault: VaultDefinitionModel,
  type: string,
): CachedValueSource {
  return Object.assign(new CachedValueSource(), {
    addressValueSourceType: `${vault.address}_${type}`,
    address: vault.address,
    type,
    apr: valueSource.apr,
    name: valueSource.name,
    minApr: valueSource.minApr,
    maxApr: valueSource.maxApr,
    boostable: valueSource.boostable,
  });
}

export async function getVaultValueSources(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
): Promise<CachedValueSource[]> {
  // manual over ride for removed compounding of vaults - this can be empty
  const NO_COMPOUND_VAULTS = new Set([TOKENS.BREMBADGER, TOKENS.BVECVX, TOKENS.BCVX]);

  let sources: CachedValueSource[] = [];
  try {
    sources = await getVaultPerformance(chain, vaultDefinition);

    const hasNoUnderlying = NO_COMPOUND_VAULTS.has(vaultDefinition.address);
    if (hasNoUnderlying) {
      sources = sources.filter((s) => s.type !== SourceType.Compound && s.type !== SourceType.PreCompound);
    }

    return sources;
  } catch (err) {
    console.log({ vaultDefinition, err, sources });
    return [];
  }
}

export async function getProtocolValueSources(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
): Promise<CachedValueSource[]> {
  try {
    switch (vaultDefinition.protocol) {
      case Protocol.Sushiswap:
        return SushiswapStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.Curve:
      case Protocol.Convex:
        return ConvexStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.Uniswap:
        return UniswapStrategy.getValueSources(vaultDefinition);
      case Protocol.Quickswap:
        return QuickswapStrategy.getValueSources(vaultDefinition);
      case Protocol.Swapr:
        return SwaprStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.OxDAO:
        return OxDaoStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.Aura:
      case Protocol.Balancer:
        return BalancerStrategy.getValueSources(vaultDefinition);
      default: {
        return [];
      }
    }
  } catch (error) {
    console.log({ error, message: `Failed to update value sources for ${vaultDefinition.protocol}` });
    return [];
  }
}
