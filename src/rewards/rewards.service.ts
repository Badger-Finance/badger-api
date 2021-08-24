import { Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { BOUNCER_PROOFS, ONE_YEAR_SECONDS, REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { Digg__factory, RewardsLogger__factory } from '../contracts';
import { getPrice } from '../prices/prices.utils';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getCachedSett } from '../setts/setts.utils';
import { formatBalance, getToken } from '../tokens/tokens.utils';
import { Boost } from './interfaces/boost.interface';
import { BoostData } from './interfaces/boost-data.interface';
import { BoostMultipliers } from './interfaces/boost-multipliers.interface';
import { Eligibility } from './interfaces/eligibility.interface';
import { AirdropMerkleClaim, AirdropMerkleDistribution } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaim } from './interfaces/reward-merkle-claim.interface';
import { getTreeDistribution } from './rewards.utils';

@Service()
export class RewardsService {
  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getUserAirdrop(airdrop: string, address: string): Promise<AirdropMerkleClaim> {
    const airdropFile = await getObject(REWARD_DATA, airdrop);
    const fileContents: AirdropMerkleDistribution = JSON.parse(airdropFile.toString('utf-8'));
    const claim = fileContents.claims[address.toLowerCase()];
    if (!claim) {
      throw new NotFound(`${address} does not qualify for airdrop`);
    }
    return claim;
  }

  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getBouncerProof(address: string): Promise<AirdropMerkleClaim> {
    const airdropFile = await getObject(REWARD_DATA, BOUNCER_PROOFS);
    const fileContents: AirdropMerkleDistribution = JSON.parse(airdropFile.toString('utf-8'));
    const claim = fileContents.claims[ethers.utils.getAddress(address)];
    if (!claim) {
      throw new NotFound(`${address} is not on the bouncer list`);
    }
    return claim;
  }

  /**
   * Get badger tree reward merkle claim for a user.
   * @param address User Ethereum address.
   */
  async getUserRewards(address: string): Promise<RewardMerkleClaim> {
    const treeDistribution = await getTreeDistribution();
    const claim = treeDistribution.claims[address];
    if (!claim) {
      throw new NotFound(`${address} does not have claimable rewards.`);
    }
    return claim;
  }

  /**
   * Get badger shop eligibility for a user.
   * Returns 200 on eligible, 403 on not eligible.
   * @param address User Ethereum address.
   */
  async checkBouncerList(address: string): Promise<Eligibility> {
    let eligible = false;
    try {
      await this.getBouncerProof(address);
      eligible = true;
    } catch (err) {} // not found, not eligible
    return {
      isEligible: eligible,
    };
  }

  static async getUserBoosts(addresses: string[]): Promise<Record<string, Boost>> {
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const fileContents: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const defaultMultipliers: BoostMultipliers = {};
    Object.keys(fileContents.multiplierData).forEach(
      (key) => (defaultMultipliers[key] = fileContents.multiplierData[key].min),
    );
    const userBoosts: Record<string, Boost> = {};
    for (const address of addresses) {
      let boostData = fileContents.userData[address.toLowerCase()];
      if (!boostData) {
        boostData = {
          boost: 1,
          stakeRatio: 0,
          nftMultiplier: 1,
          multipliers: defaultMultipliers,
          nativeBalance: 0,
          nonNativeBalance: 0,
        };
      } else {
        const userMulipliers = boostData.multipliers;
        const missingMultipliers = Object.keys(defaultMultipliers).length !== Object.keys(userMulipliers).length;
        if (missingMultipliers) {
          const includedMultipliers = new Set();
          const totalPercentile = Object.entries(userMulipliers)
            .map((entry) => {
              const [key, value] = entry;
              includedMultipliers.add(key);
              const min = fileContents.multiplierData[key].min;
              const max = fileContents.multiplierData[key].max;
              const range = max - min;
              return (value - min) / range;
            })
            .reduce((total, value) => (total += value), 0);
          const percentile = totalPercentile / Object.entries(userMulipliers).length;
          Object.entries(fileContents.multiplierData).forEach((entry) => {
            const [key, value] = entry;
            if (!includedMultipliers.has(key)) {
              const range = value.max - value.min;
              userMulipliers[key] = value.min + percentile * range;
            }
          });
        }
        boostData.multipliers = userMulipliers;
      }
      userBoosts[address] = boostData;
    }
    return userBoosts;
  }

  static async getRewardEmission(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource[]> {
    if (!chain.rewardsLogger || settDefinition.depositToken === TOKENS.DIGG) {
      return [];
    }
    const { settToken } = settDefinition;
    const sett = await getCachedSett(settDefinition);
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const boostData: BoostData = JSON.parse(boostFile.toString('utf-8'));
    let boostRange = { min: 1, max: 1 };
    if (boostData.multiplierData) {
      boostRange = boostData.multiplierData[sett.vaultToken];
    }

    // create relevant contracts
    const rewardsLogger = RewardsLogger__factory.connect(chain.rewardsLogger, chain.provider);

    let sharesPerFragment = BigNumber.from(1);
    if (chain.network === ChainNetwork.Ethereum) {
      const diggContract = Digg__factory.connect(TOKENS.DIGG, chain.provider);
      sharesPerFragment = await diggContract._sharesPerFragment();
    }

    // filter active unlock schedules
    const unlockSchedules = await rewardsLogger.getAllUnlockSchedulesFor(settToken);

    if (unlockSchedules.length === 0) {
      return [];
    }

    const cutoff = new Date();
    cutoff.setMinutes(-20);
    const cutOffTimestamp = parseInt((cutoff.getTime() / 1000).toString());
    const includedTokens = new Set();
    const activeSchedules = unlockSchedules
      .slice()
      .sort((a, b) => b.end.sub(a.end).toNumber())
      .filter((schedule) => {
        if (includedTokens.has(schedule.token)) {
          return false;
        }
        const isActive = schedule.end.gte(cutOffTimestamp);
        if (isActive) {
          includedTokens.add(schedule.token);
        }
        return isActive;
      });

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
    const emissionSources: ValueSource[] = [];
    for (const schedule of activeSchedules) {
      const price = await getPrice(schedule.token);
      const token = getToken(schedule.token);
      let emission = schedule.totalAmount;
      if (token.address === TOKENS.DIGG) {
        emission = emission.div(sharesPerFragment);
      }
      const amount = formatBalance(emission, token.decimals);
      const durationScalar = ONE_YEAR_SECONDS / schedule.duration.toNumber();
      const yearlyEmission = price.usd * amount * durationScalar;
      const apr = (yearlyEmission / sett.value) * 100;
      emissionSources.push(createValueSource(`${token.name} Rewards`, uniformPerformance(apr), false, boostRange));
    }
    return emissionSources;
  }
}
