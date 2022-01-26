import { Network, Protocol, ValueSource } from '@badger-dao/sdk';
import { getBoostFile, getCachedAccount } from '../accounts/accounts.utils';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_YEAR_SECONDS, REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { getPrice } from '../prices/prices.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { getVaultCachedValueSources, tokenEmission } from '../protocols/protocols.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getCachedVault } from '../vaults/vaults.utils';
import { Token } from '../tokens/interfaces/token.interface';
import { getToken } from '../tokens/tokens.utils';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';
import { BadgerTree__factory } from '../contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { UnprocessableEntity } from '@tsed/exceptions';
import { EmissionSchedule } from '@badger-dao/sdk/lib/rewards/interfaces/emission-schedule.interface';
import { VaultsService } from '../vaults/vaults.service';
import { SourceType } from './enums/source-type.enum';
import { getCurvePerformance, ConvexStrategy } from '../protocols/strategies/convex.strategy';
import { mStableStrategy } from '../protocols/strategies/mstable.strategy';
import { PancakeswapStrategy } from '../protocols/strategies/pancakeswap.strategy';
import { QuickswapStrategy } from '../protocols/strategies/quickswap.strategy';
import { SushiswapStrategy } from '../protocols/strategies/sushiswap.strategy';
import { UniswapStrategy } from '../protocols/strategies/uniswap.strategy';
import { SwaprStrategy } from '../protocols/strategies/swapr.strategy';
import { getDataMapper } from '../aws/dynamodb.utils';

export async function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null> {
  if (!chain.badgerTree) {
    return null;
  }
  const fileName = `badger-tree-${parseInt(chain.chainId, 16)}.json`;
  const rewardFile = await getObject(REWARD_DATA, fileName);
  return JSON.parse(rewardFile.toString('utf-8'));
}

export function noRewards(VaultDefinition: VaultDefinition, token: Token) {
  return valueSourceToCachedValueSource(
    createValueSource(`${token.symbol} Rewards`, uniformPerformance(0)),
    VaultDefinition,
    tokenEmission(token),
  );
}

export async function getClaimableRewards(
  chain: Chain,
  chainUsers: string[],
  distribution: RewardMerkleDistribution,
  blockNumber: number,
): Promise<[string, [string[], BigNumber[]]][]> {
  if (!chain.badgerTree) {
    throw new UnprocessableEntity(`No BadgerTree is available from ${chain.name}`);
  }
  const tree = BadgerTree__factory.connect(chain.badgerTree, chain.batchProvider);
  const requests = chainUsers.map(async (user): Promise<[string, [string[], BigNumber[]]]> => {
    const proof = distribution.claims[user];
    if (!proof) {
      return [user, [[], []]];
    }
    let attempt = 0;
    while (attempt < 3) {
      try {
        const result = await tree.getClaimableFor(user, proof.tokens, proof.cumulativeAmounts, {
          blockTag: blockNumber,
        });
        return [user, result];
      } catch {
        if (proof.tokens.includes(TOKENS.DIGG)) {
          const index = proof.tokens.indexOf(TOKENS.DIGG);
          proof.cumulativeAmounts[index] = (await tree.claimed(user, TOKENS.DIGG)).toString();
        }
        attempt++;
      }
    }
    return [user, [[], []]];
  });
  return Promise.all(requests);
}

const schedulesCache: Record<string, EmissionSchedule[]> = {};

export async function getRewardEmission(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const boostFile = await getBoostFile(chain);
  if (!chain.rewardsLogger || vaultDefinition.depositToken === TOKENS.DIGG || !boostFile) {
    return [];
  }
  const { vaultToken } = vaultDefinition;
  const vault = await getCachedVault(vaultDefinition);
  if (vault.vaultToken === TOKENS.BVECVX) {
    delete boostFile.multiplierData[vault.vaultToken];
  }
  const boostRange = boostFile.multiplierData[vault.vaultToken] ?? { min: 1, max: 1 };

  if (!schedulesCache[vaultDefinition.vaultToken]) {
    const sdk = await chain.getSdk();
    schedulesCache[vaultDefinition.vaultToken] = await sdk.rewards.loadActiveSchedules(vaultToken);
  }
  const activeSchedules = schedulesCache[vaultDefinition.vaultToken];

  // Badger controlled addresses are blacklisted from receiving rewards. We only dogfood on ETH
  let ignoredTVL = 0;
  if (chain.network === Network.Ethereum) {
    const blacklistedAccounts = await Promise.all([
      getCachedAccount(chain, '0xB65cef03b9B89f99517643226d76e286ee999e77'), // dev multisig
      getCachedAccount(chain, '0x86cbD0ce0c087b482782c181dA8d191De18C8275'), // tech ops multisig
      getCachedAccount(chain, '0x042B32Ac6b453485e357938bdC38e0340d4b9276'), // treasury ops multisig
      getCachedAccount(chain, '0xD0A7A8B98957b9CD3cFB9c0425AbE44551158e9e'), // treasury vault
    ]);
    ignoredTVL = blacklistedAccounts
      .map((a) => a.data[vault.vaultToken])
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
   *
   */

  const emissionSources = [];
  for (const schedule of activeSchedules) {
    const [price, token] = await Promise.all([getPrice(schedule.token), getToken(schedule.token)]);
    const durationScalar = ONE_YEAR_SECONDS / (schedule.end - schedule.start);
    const yearlyEmission = price.usd * schedule.amount * durationScalar;
    const apr = (yearlyEmission / (vault.value - ignoredTVL)) * 100;
    let proRataAPR = apr;
    if (vault.boost.enabled && token.address === chain.getBadgerTokenAddress()) {
      const boostedAPR = (vault.boost.weight / 10_000) * proRataAPR;
      proRataAPR = proRataAPR - boostedAPR;
      const boostedSource = createValueSource(
        `Boosted ${token.name} Rewards`,
        uniformPerformance(boostedAPR),
        false,
        boostRange,
      );
      emissionSources.push(valueSourceToCachedValueSource(boostedSource, vaultDefinition, tokenEmission(token, true)));
    }
    const proRataSource = createValueSource(`${token.name} Rewards`, uniformPerformance(proRataAPR));
    emissionSources.push(valueSourceToCachedValueSource(proRataSource, vaultDefinition, tokenEmission(token)));
  }
  return emissionSources;
}

export const valueSourceToCachedValueSource = (
  valueSource: ValueSource,
  vaultDefinition: VaultDefinition,
  type: string,
): CachedValueSource => {
  return Object.assign(new CachedValueSource(), {
    addressValueSourceType: `${vaultDefinition.vaultToken}_${type}`,
    address: vaultDefinition.vaultToken,
    type,
    apr: valueSource.apr,
    name: valueSource.name,
    oneDay: valueSource.performance.oneDay,
    threeDay: valueSource.performance.threeDay,
    sevenDay: valueSource.performance.sevenDay,
    thirtyDay: valueSource.performance.thirtyDay,
    harvestable: Boolean(valueSource.harvestable),
    minApr: valueSource.minApr,
    maxApr: valueSource.maxApr,
    boostable: valueSource.boostable,
  });
};

export async function getUnderlyingPerformance(VaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  return valueSourceToCachedValueSource(
    await VaultsService.getSettPerformance(VaultDefinition),
    VaultDefinition,
    SourceType.Compound,
  );
}

export async function getVaultValueSources(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  // manual over ride for removed compounding of vaults - this can be empty
  const NO_COMPOUND_VAULTS = new Set([TOKENS.BCVXCRV]);
  // TODO: remove this once we have vaults 1.5, and token emission (tree events) added
  const ARB_CRV_SETTS = new Set([TOKENS.BARB_CRV_RENBTC, TOKENS.BARB_CRV_TRICRYPTO, TOKENS.BARB_CRV_TRICRYPTO_LITE]);

  try {
    const [underlying, emission, protocol] = await Promise.all([
      getUnderlyingPerformance(vaultDefinition),
      getRewardEmission(chain, vaultDefinition),
      getProtocolValueSources(chain, vaultDefinition),
    ]);

    // check for any emission removal
    const oldSources: Record<string, CachedValueSource> = {};
    const oldEmission = await getVaultCachedValueSources(vaultDefinition);
    oldEmission.forEach((source) => (oldSources[source.addressValueSourceType] = source));

    const newSources = [...emission, ...protocol];
    // remove updated sources from old source list
    const hasUnderlying = !NO_COMPOUND_VAULTS.has(vaultDefinition.vaultToken);
    if (hasUnderlying) {
      newSources.push(underlying);
    }

    // TODO: remove once badger tree tracking events supported
    if (ARB_CRV_SETTS.has(vaultDefinition.vaultToken)) {
      const crvSource = createValueSource('CRV Rewards', uniformPerformance(underlying.apr));
      newSources.push(
        valueSourceToCachedValueSource(crvSource, vaultDefinition, tokenEmission(getToken(TOKENS.ARB_CRV))),
      );
    }
    newSources.forEach((source) => delete oldSources[source.addressValueSourceType]);

    // delete sources which are no longer valid
    const mapper = getDataMapper();
    await Promise.all(Array.from(Object.values(oldSources)).map((source) => mapper.delete(source)));
    return newSources;
  } catch (err) {
    console.log({ vaultDefinition, err });
    return [];
  }
}

export async function getProtocolValueSources(
  chain: Chain,
  VaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  try {
    switch (VaultDefinition.protocol) {
      case Protocol.Curve:
        return Promise.all([getCurvePerformance(chain, VaultDefinition)]);
      case Protocol.Pancakeswap:
        return PancakeswapStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Sushiswap:
        return SushiswapStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Convex:
        return ConvexStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Uniswap:
        return UniswapStrategy.getValueSources(VaultDefinition);
      case Protocol.Quickswap:
        return QuickswapStrategy.getValueSources(VaultDefinition);
      case Protocol.mStable:
        return mStableStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Swapr:
        return SwaprStrategy.getValueSources(chain, VaultDefinition);
      default: {
        return [];
      }
    }
  } catch (error) {
    console.log(error);
    // Silently return no value sources
    return [];
  }
}
