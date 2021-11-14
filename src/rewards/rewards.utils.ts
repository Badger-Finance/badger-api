import BadgerSDK, { Network } from '@badger-dao/sdk';
import { getBoostFile, getCachedBoost } from '../accounts/accounts.utils';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_YEAR_SECONDS, REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { EmissionControl__factory } from '../contracts';
import { valueSourceToCachedValueSource } from '../indexer/indexer.utils';
import { getPrice } from '../prices/prices.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { tokenEmission } from '../protocols/protocols.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getCachedSett } from '../setts/setts.utils';
import { Token } from '../tokens/interfaces/token.interface';
import { getToken } from '../tokens/tokens.utils';
import { BoostMultipliers } from './interfaces/boost-multipliers.interface';
import { CachedBoostMultiplier } from './interfaces/cached-boost-multiplier.interface';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';

export async function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null> {
  if (!chain.badgerTree) {
    return null;
  }
  const appendChainId = chain.network != Network.Ethereum;
  const fileName = `badger-tree${appendChainId ? `-${parseInt(chain.chainId, 16)}` : ''}.json`;
  const rewardFile = await getObject(REWARD_DATA, fileName);
  return JSON.parse(rewardFile.toString('utf-8'));
}

export function noRewards(settDefinition: SettDefinition, token: Token) {
  return valueSourceToCachedValueSource(
    createValueSource(`${token.symbol} Rewards`, uniformPerformance(0)),
    settDefinition,
    tokenEmission(token),
  );
}

export async function getUserBoostMultipliers(
  chains: Chain[],
  addresses: string[],
): Promise<Record<string, CachedBoostMultiplier[]>> {
  const results = await Promise.all(chains.flatMap(async (chain) => getChainUserBoosts(chain, addresses)));
  const crossChainBoosts: Record<string, CachedBoostMultiplier[]> = {};
  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (crossChainBoosts[key]) {
        crossChainBoosts[key] = crossChainBoosts[key].concat(value);
      } else {
        crossChainBoosts[key] = value;
      }
    }
  }
  return crossChainBoosts;
}

async function getChainUserBoosts(chain: Chain, addresses: string[]): Promise<Record<string, CachedBoostMultiplier[]>> {
  try {
    const boostFile = await getBoostFile(chain);
    if (!boostFile) {
      return {};
    }
    const defaultMultipliers: BoostMultipliers = {};
    Object.keys(boostFile.multiplierData).forEach(
      (key) => (defaultMultipliers[key] = boostFile.multiplierData[key].min),
    );
    const boostMultipliers: Record<string, CachedBoostMultiplier[]> = {};
    for (const address of addresses) {
      let boostData = boostFile.userData[address] || boostFile.userData[address.toLowerCase()];
      if (!boostData) {
        boostData = {
          boost: 1,
          stakeRatio: 1,
          nftMultiplier: 1,
          multipliers: defaultMultipliers,
          nativeBalance: 0,
          nonNativeBalance: 0,
        };
      } else {
        const userMulipliers = boostData.multipliers;
        const missingMultipliers = Object.keys(defaultMultipliers).length !== Object.keys(userMulipliers).length;
        if (missingMultipliers) {
          const boost = await getCachedBoost(chain, address);
          const percentile = boost.boost / 2000;
          const includedMultipliers = new Set();
          Object.entries(userMulipliers).forEach(includedMultipliers.add);
          Object.entries(boostFile.multiplierData).forEach((entry) => {
            const [key, value] = entry;
            if (!includedMultipliers.has(key)) {
              const range = value.max - value.min;
              userMulipliers[key] = value.min + percentile * range;
            }
          });
        }
        boostData.multipliers = userMulipliers;
      }
      boostMultipliers[address] = Object.entries(boostData.multipliers)
        .filter((e) => !isNaN(e[1]))
        .map(
          (entry) => (
            new CachedBoostMultiplier(),
            {
              network: chain.network,
              address: entry[0],
              multiplier: entry[1],
            }
          ),
        );
    }
    return boostMultipliers;
  } catch (err) {
    return {};
  }
}

export async function getRewardEmission(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const boostFile = await getBoostFile(chain);
  if (!chain.rewardsLogger || settDefinition.depositToken === TOKENS.DIGG || !boostFile) {
    return [];
  }
  const { settToken } = settDefinition;
  const sett = await getCachedSett(settDefinition);
  if (sett.settToken === TOKENS.BICVX) {
    delete boostFile.multiplierData[sett.settToken];
  }
  const boostRange = boostFile.multiplierData[sett.settToken] ?? { min: 1, max: 1 };
  const sdk = new BadgerSDK(parseInt(chain.chainId, 16), chain.batchProvider);
  await sdk.ready();
  const activeSchedules = await sdk.rewards.loadActiveSchedules(settToken);

  let emissionControl;
  if (chain.emissionControl) {
    emissionControl = EmissionControl__factory.connect(chain.emissionControl, chain.batchProvider);
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
    const [price, token] = await Promise.all([getPrice(schedule.token), getToken(schedule.token)]);
    const durationScalar = ONE_YEAR_SECONDS / (schedule.end - schedule.start);
    const yearlyEmission = price.usd * schedule.amount * durationScalar;
    const apr = (yearlyEmission / sett.value) * 100;
    let proRataAPR = apr;
    // todo: atm, only native badger on eth has a pro rata split for ibbtc vault - will need a flexible native badger token per chain
    if (emissionControl && token.address === chain.getBadgerTokenAddress()) {
      const boostedRate = await emissionControl.boostedEmissionRate(sett.settToken);
      const boostedAPR = (boostedRate.toNumber() / 10_000) * proRataAPR;
      proRataAPR = proRataAPR - boostedAPR;
      const boostedSource = createValueSource(
        `Boosted ${token.name} Rewards`,
        uniformPerformance(boostedAPR),
        false,
        boostRange,
      );
      emissionSources.push(valueSourceToCachedValueSource(boostedSource, settDefinition, tokenEmission(token, true)));
    }
    const proRataSource = createValueSource(`${token.name} Rewards`, uniformPerformance(proRataAPR));
    emissionSources.push(valueSourceToCachedValueSource(proRataSource, settDefinition, tokenEmission(token)));
  }
  return emissionSources;
}
