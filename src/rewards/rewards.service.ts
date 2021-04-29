import { Inject, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { S3Service } from '../aws/s3.service';
import { CacheService } from '../cache/cache.service';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { diggAbi } from '../config/abi/abi';
import { rewardsLoggerAbi, rewardsLoggerAddress } from '../config/abi/rewards-logger.abi';
import { BOUNCER_PROOFS, ONE_YEAR_SECONDS, REWARD_DATA, TOKENS } from '../config/constants';
import { getPrice } from '../prices/prices.utils';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getCachcedSett } from '../setts/setts.utils';
import { getToken } from '../tokens/tokens.utils';
import { Eligibility } from './interfaces/eligibility.interface';
import {
  AirdropMerkleClaim,
  AirdropMerkleDistribution,
  RewardMerkleClaim,
  RewardMerkleDistribution,
} from './interfaces/merkle-distributor.interface';
import { UnlockSchedule } from './interfaces/unlock-schedule.interface';

@Service()
export class RewardsService {
  @Inject()
  s3Service!: S3Service;
  @Inject()
  cacheService!: CacheService;

  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getUserAirdrop(airdrop: string, address: string): Promise<AirdropMerkleClaim> {
    const airdropFile = await this.s3Service.getObject(REWARD_DATA, airdrop);
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
    const airdropFile = await this.s3Service.getObject(REWARD_DATA, BOUNCER_PROOFS);
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
    const rewardFile = await this.s3Service.getObject(REWARD_DATA, 'badger-tree.json');
    const fileContents: RewardMerkleDistribution = JSON.parse(rewardFile.toString('utf-8'));
    const claim = fileContents.claims[address];
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

  static async getRewardEmission(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource[]> {
    if (chain.network !== ChainNetwork.Ethereum) {
      return [];
    }
    const { settToken } = settDefinition;
    const sett = await getCachcedSett(settDefinition);

    // create relevant contracts
    const rewardsLogger = new ethers.Contract(rewardsLoggerAddress, rewardsLoggerAbi, chain.provider);
    const diggContract = new ethers.Contract(TOKENS.DIGG, diggAbi, chain.provider);
    const sharesPerFragment: BigNumber = await diggContract._sharesPerFragment();

    // filter active unlock schedules
    const unlockSchedules: UnlockSchedule[] = await rewardsLogger.getAllUnlockSchedulesFor(settToken);

    if (unlockSchedules.length === 0) {
      return [];
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);
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
     * and persisted against that sett. There is a one day grace period for
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
      const amount = parseFloat(ethers.utils.formatUnits(emission, token.decimals));
      const durationScalar = ONE_YEAR_SECONDS / schedule.duration.toNumber();
      const yearlyEmission = price.usd * amount * durationScalar;
      const apr = (yearlyEmission / sett.settValue) * 100;
      emissionSources.push({
        name: `${token.name} Rewards`,
        apy: apr,
        performance: uniformPerformance(apr),
      });
    }
    return emissionSources;
  }
}
